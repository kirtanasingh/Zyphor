"""
models/markov.py

Markov chain form model for esports teams.
Uses last N match results + score differentials from matches.csv.

Schema: match_id, teamA, teamB, winner, map, date, scoreA, scoreB
"""

import pandas as pd
from utils.preprocess import get_team_matches


# ── Form Thresholds ───────────────────────────────────────────────────────────

def get_team_form(team_name: str, last_n: int = 7) -> dict:
    """
    Evaluates team form from last N matches.

    Form buckets:
      Hot     → win_rate >= 0.71  (5+ wins out of 7)
      Warm    → win_rate >= 0.57  (4 wins)
      Neutral → win_rate >= 0.43  (3 wins)
      Cold    → win_rate >= 0.29  (2 wins)
      Freezing→ win_rate <  0.29  (0–1 wins)

    Also factors in average score differential as a tiebreaker.
    """
    matches = get_team_matches(team_name)
    recent  = matches.head(last_n)

    wins   = int((recent["winner"] == team_name).sum())
    losses = len(recent) - wins
    win_rate = round(wins / len(recent), 4) if len(recent) > 0 else 0.0

    # Score differential (esports-specific — rounds/maps won vs lost)
    as_a = recent[recent["teamA"] == team_name]
    as_b = recent[recent["teamB"] == team_name]

    score_diff_list = []
    if not as_a.empty and "scoreA" in as_a.columns:
        score_diff_list += (as_a["scoreA"] - as_a["scoreB"]).tolist()
    if not as_b.empty and "scoreB" in as_b.columns:
        score_diff_list += (as_b["scoreB"] - as_b["scoreA"]).tolist()

    avg_score_diff = round(sum(score_diff_list) / len(score_diff_list), 2) if score_diff_list else 0.0

    # Form label
    if win_rate >= 0.71:
        form = "Hot"
    elif win_rate >= 0.57:
        form = "Warm"
    elif win_rate >= 0.43:
        form = "Neutral"
    elif win_rate >= 0.29:
        form = "Cold"
    else:
        form = "Freezing"

    # Streak (current consecutive wins or losses)
    streak_val  = 0
    streak_type = None
    for _, row in recent.iterrows():
        won = row["winner"] == team_name
        if streak_type is None:
            streak_type = "W" if won else "L"
            streak_val  = 1
        elif (streak_type == "W" and won) or (streak_type == "L" and not won):
            streak_val += 1
        else:
            break

    return {
        "form":            form,
        "wins":            wins,
        "losses":          losses,
        "win_rate":        win_rate,
        "avg_score_diff":  avg_score_diff,
        "current_streak":  f"{streak_type}{streak_val}" if streak_type else "N/A",
        "matches_checked": len(recent),
    }


# ── Markov Transition Matrix ──────────────────────────────────────────────────
# Used by the simulator to project form changes across simulated matches.

FORM_ORDER = ["Hot", "Warm", "Neutral", "Cold", "Freezing"]

TRANSITION_MATRIX = {
    #         Hot    Warm   Neutral  Cold   Freezing
    "Hot":     [0.60, 0.25,  0.10,   0.04,  0.01],
    "Warm":    [0.25, 0.40,  0.25,   0.08,  0.02],
    "Neutral": [0.10, 0.25,  0.40,   0.20,  0.05],
    "Cold":    [0.04, 0.10,  0.30,   0.40,  0.16],
    "Freezing":[0.01, 0.05,  0.20,   0.35,  0.39],
}


def get_next_form(current_form: str) -> str:
    """
    Probabilistically transitions to next form state.
    Used in multi-match Monte Carlo simulation.
    """
    import random
    probs = TRANSITION_MATRIX.get(current_form, TRANSITION_MATRIX["Neutral"])
    return random.choices(FORM_ORDER, weights=probs, k=1)[0]