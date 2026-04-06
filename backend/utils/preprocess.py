"""
utils/preprocess.py

Data loading + query helpers.
Exact schema: match_id, teamA, teamB, winner, map, date, scoreA, scoreB
"""

import pandas as pd
from functools import lru_cache
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


# ── Loaders (cached — reads CSV only once per server start) ───────────────────

@lru_cache(maxsize=1)
def load_matches() -> pd.DataFrame:
    path = DATA_DIR / "matches.csv"
    if not path.exists():
        raise FileNotFoundError(f"matches.csv not found at {path}")

    df = pd.read_csv(path)
    df["date"] = pd.to_datetime(df["date"], errors="coerce")
    df = df.sort_values("date", ascending=False).reset_index(drop=True)
    return df


@lru_cache(maxsize=1)
def load_players() -> pd.DataFrame:
    path = DATA_DIR / "players.csv"
    if not path.exists():
        raise FileNotFoundError(f"players.csv not found at {path}")
    return pd.read_csv(path)


@lru_cache(maxsize=1)
def load_teams() -> pd.DataFrame:
    path = DATA_DIR / "teams.csv"
    if not path.exists():
        return pd.DataFrame()   # optional file
    return pd.read_csv(path)


# ── Match Queries ─────────────────────────────────────────────────────────────

def get_team_matches(team_name: str) -> pd.DataFrame:
    """All matches where team appears as teamA or teamB, sorted newest first."""
    df = load_matches()
    mask = (df["teamA"] == team_name) | (df["teamB"] == team_name)
    result = df[mask].copy()

    if result.empty:
        raise ValueError(f"No matches found for team '{team_name}'")

    return result.reset_index(drop=True)


def get_head_to_head_matches(teamA: str, teamB: str) -> pd.DataFrame:
    """Only matches between exactly teamA and teamB."""
    df = load_matches()
    mask = (
        ((df["teamA"] == teamA) & (df["teamB"] == teamB)) |
        ((df["teamA"] == teamB) & (df["teamB"] == teamA))
    )
    return df[mask].copy().reset_index(drop=True)


def get_map_stats(teamA: str, teamB: str) -> dict:
    """
    Per-map win rates between teamA and teamB.
    Returns { map_name: { teamA_wins, teamB_wins, total, teamA_win_pct } }
    """
    h2h = get_head_to_head_matches(teamA, teamB)
    if h2h.empty or "map" not in h2h.columns:
        return {}

    result = {}
    for map_name, group in h2h.groupby("map"):
        wA = int((group["winner"] == teamA).sum())
        wB = int((group["winner"] == teamB).sum())
        total = wA + wB
        result[map_name] = {
            "teamA_wins":    wA,
            "teamB_wins":    wB,
            "total":         total,
            "teamA_win_pct": round(wA / total * 100, 1) if total > 0 else 0,
        }

    return result


def get_score_stats(team_name: str) -> dict:
    """
    Average scores for/against for a team using scoreA, scoreB columns.
    """
    df = get_team_matches(team_name)

    as_a = df[df["teamA"] == team_name].copy()
    as_b = df[df["teamB"] == team_name].copy()

    as_a["team_score"] = as_a["scoreA"]
    as_a["opp_score"]  = as_a["scoreB"]
    as_b["team_score"] = as_b["scoreB"]
    as_b["opp_score"]  = as_b["scoreA"]

    combined = pd.concat([as_a, as_b])

    return {
        "avg_score_for":     round(combined["team_score"].mean(), 2),
        "avg_score_against": round(combined["opp_score"].mean(), 2),
        "avg_score_diff":    round((combined["team_score"] - combined["opp_score"]).mean(), 2),
    }