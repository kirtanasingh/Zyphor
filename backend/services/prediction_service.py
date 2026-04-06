"""
services/prediction_service.py

Multi-factor prediction model for esports matches.

Factors used (weighted):
  1. Current form (win rate last 7 matches)      → 40%
  2. Head-to-head win rate                       → 25%
  3. Score differential (rounds/maps avg)        → 20%
  4. Recency bias (last 3 matches weighted more) → 15%

Also runs Monte Carlo simulation (1000 matches by default).
"""

import random
from models.markov import get_team_form, get_next_form, TRANSITION_MATRIX, FORM_ORDER
from utils.preprocess import (
    get_team_matches,
    get_head_to_head_matches,
    get_score_stats,
)


# ── Form → base strength score ────────────────────────────────────────────────

FORM_STRENGTH = {
    "Hot":      0.80,
    "Warm":     0.65,
    "Neutral":  0.50,
    "Cold":     0.35,
    "Freezing": 0.20,
}


# ── Factor 1: Form Score (40%) ────────────────────────────────────────────────

def _form_score(form_data: dict) -> float:
    return FORM_STRENGTH.get(form_data["form"], 0.50)


# ── Factor 2: Head-to-Head Win Rate (25%) ────────────────────────────────────

def _h2h_score(teamA: str, teamB: str) -> float:
    """Returns teamA's win rate vs teamB historically. 0.5 if no H2H data."""
    h2h = get_head_to_head_matches(teamA, teamB)
    if h2h.empty:
        return 0.50   # no data → neutral

    total = len(h2h)
    winsA = int((h2h["winner"] == teamA).sum())
    return round(winsA / total, 4)


# ── Factor 3: Score Differential (20%) ───────────────────────────────────────

def _score_diff_score(teamA: str, teamB: str) -> float:
    """
    Converts average score differential into a probability.
    Uses sigmoid-like normalization capped at ±10 rounds/maps.
    """
    try:
        statsA = get_score_stats(teamA)
        statsB = get_score_stats(teamB)
        diff = statsA["avg_score_diff"] - statsB["avg_score_diff"]
        # Normalize: diff of +10 → ~0.75, 0 → 0.5, -10 → ~0.25
        normalized = 0.5 + (diff / 20.0)
        return max(0.10, min(0.90, normalized))
    except Exception:
        return 0.50


# ── Factor 4: Recency Bias — last 3 matches (15%) ────────────────────────────

def _recency_score(team_name: str) -> float:
    """Win rate in the last 3 matches only."""
    try:
        recent = get_team_matches(team_name).head(3)
        wins = int((recent["winner"] == team_name).sum())
        return round(wins / len(recent), 4)
    except Exception:
        return 0.50


# ── Combined Probability ──────────────────────────────────────────────────────

WEIGHTS = {
    "form":    0.40,
    "h2h":     0.25,
    "score":   0.20,
    "recency": 0.15,
}


def _compute_probability(teamA: str, teamB: str, formA: dict, formB: dict) -> dict:
    """
    Computes final win probability for teamA using weighted multi-factor model.
    Returns probability for teamA and a breakdown of each factor's contribution.
    """
    # Raw scores for each factor
    form_A    = _form_score(formA)
    form_B    = _form_score(formB)
    h2h_A     = _h2h_score(teamA, teamB)
    score_A   = _score_diff_score(teamA, teamB)
    recency_A = _recency_score(teamA)
    recency_B = _recency_score(teamB)

    # Normalize form and recency into relative probability (A vs B)
    form_prob    = form_A / (form_A + form_B)      if (form_A + form_B) > 0 else 0.50
    recency_prob = recency_A / (recency_A + recency_B) if (recency_A + recency_B) > 0 else 0.50

    # Weighted combination
    prob = (
        WEIGHTS["form"]    * form_prob    +
        WEIGHTS["h2h"]     * h2h_A        +
        WEIGHTS["score"]   * score_A      +
        WEIGHTS["recency"] * recency_prob
    )

    prob = max(0.05, min(0.95, prob))   # clamp to realistic range

    return {
        "final_prob":  round(prob, 4),
        "breakdown": {
            "form_contribution":    round(WEIGHTS["form"]    * form_prob,    4),
            "h2h_contribution":     round(WEIGHTS["h2h"]     * h2h_A,        4),
            "score_contribution":   round(WEIGHTS["score"]   * score_A,      4),
            "recency_contribution": round(WEIGHTS["recency"] * recency_prob, 4),
        }
    }


# ── Main Prediction ───────────────────────────────────────────────────────────

def predict_match(teamA: str, teamB: str) -> dict:
    """
    Full multi-factor prediction. Returns probability + form + factor breakdown.
    """
    formA = get_team_form(teamA)
    formB = get_team_form(teamB)

    result = _compute_probability(teamA, teamB, formA, formB)
    prob   = result["final_prob"]

    return {
        "teamA": teamA,
        "teamB": teamB,
        "teamA_win_prob": round(prob, 2),
        "teamB_win_prob": round(1 - prob, 2),
        "formA": formA,
        "formB": formB,
        "factor_breakdown": result["breakdown"],
        "model": "markov_multifactor_v2",
    }


# ── Monte Carlo Simulation ────────────────────────────────────────────────────

def simulate_match(teamA: str, teamB: str, n: int = 1000) -> dict:
    """
    Runs N simulated matches.

    Each simulation:
      - Uses base probability from predict_match
      - Applies Markov form transition each round (forms can drift)
      - Tracks streaks, map-level variation (±5% random noise per match)

    Returns win counts, percentages, streak data, and confidence interval.
    """
    prediction = predict_match(teamA, teamB)
    base_prob  = prediction["teamA_win_prob"]

    current_form_A = prediction["formA"]["form"]
    current_form_B = prediction["formB"]["form"]

    winsA = 0
    winsB = 0
    streak_log   = []   # last 20 results for UI streak display
    win_run_A    = 0    # current consecutive wins for A
    win_run_B    = 0    # current consecutive wins for B
    max_streak_A = 0
    max_streak_B = 0

    for i in range(n):
        # Transition forms every 5 matches (teams warm up / cool down)
        if i % 5 == 0 and i > 0:
            current_form_A = get_next_form(current_form_A)
            current_form_B = get_next_form(current_form_B)

        # Recompute probability using current form + small random noise
        form_a = FORM_STRENGTH.get(current_form_A, 0.50)
        form_b = FORM_STRENGTH.get(current_form_B, 0.50)
        form_prob = form_a / (form_a + form_b) if (form_a + form_b) > 0 else 0.50

        # Blend base prediction (70%) with live form (30%) + noise (±3%)
        sim_prob = 0.70 * base_prob + 0.30 * form_prob
        sim_prob += random.uniform(-0.03, 0.03)
        sim_prob  = max(0.05, min(0.95, sim_prob))

        if random.random() < sim_prob:
            winsA += 1
            streak_log.append(teamA)
            win_run_A += 1
            win_run_B  = 0
            max_streak_A = max(max_streak_A, win_run_A)
        else:
            winsB += 1
            streak_log.append(teamB)
            win_run_B += 1
            win_run_A  = 0
            max_streak_B = max(max_streak_B, win_run_B)

    # 95% confidence interval using normal approximation
    import math
    p    = winsA / n
    margin = 1.96 * math.sqrt(p * (1 - p) / n)

    return {
        "teamA": teamA,
        "teamB": teamB,
        "simulations":     n,
        "teamA_wins":      winsA,
        "teamB_wins":      winsB,
        "teamA_win_pct":   round(winsA / n * 100, 1),
        "teamB_win_pct":   round(winsB / n * 100, 1),
        "confidence_interval_95": {
            "lower": round(max(0, (p - margin) * 100), 1),
            "upper": round(min(100, (p + margin) * 100), 1),
        },
        "teamA_max_streak": max_streak_A,
        "teamB_max_streak": max_streak_B,
        "recent_streak":   streak_log[-20:],   # last 20 results for UI
        "base_prediction": prediction,
    }