"""
services/stats_service.py

H2H stats, team overview, player stats, map breakdown.
All using exact schema: match_id, teamA, teamB, winner, map, date, scoreA, scoreB
"""

import pandas as pd
from utils.preprocess import (
    get_team_matches,
    get_head_to_head_matches,
    get_map_stats,
    get_score_stats,
    load_players,
)


# ── Head-to-Head ──────────────────────────────────────────────────────────────

def get_head_to_head(teamA: str, teamB: str) -> dict:
    h2h_matches = get_head_to_head_matches(teamA, teamB)

    if h2h_matches.empty:
        return {
            "teamA": teamA,
            "teamB": teamB,
            "total_matches": 0,
            "teamA_wins": 0,
            "teamB_wins": 0,
            "teamA_win_pct": 0,
            "teamB_win_pct": 0,
            "map_breakdown": {},
            "recent_matches": [],
        }

    total  = len(h2h_matches)
    winsA  = int((h2h_matches["winner"] == teamA).sum())
    winsB  = total - winsA

    # Recent matches — return as plain dicts for JSON
    recent_cols = ["match_id", "date", "teamA", "teamB", "winner", "map", "scoreA", "scoreB"]
    available   = [c for c in recent_cols if c in h2h_matches.columns]
    recent      = h2h_matches[available].head(10).to_dict(orient="records")

    # Fix date serialization
    for m in recent:
        if "date" in m and hasattr(m["date"], "isoformat"):
            m["date"] = m["date"].isoformat()

    return {
        "teamA": teamA,
        "teamB": teamB,
        "total_matches":  total,
        "teamA_wins":     winsA,
        "teamB_wins":     winsB,
        "teamA_win_pct":  round(winsA / total * 100, 1),
        "teamB_win_pct":  round(winsB / total * 100, 1),
        "map_breakdown":  get_map_stats(teamA, teamB),
        "recent_matches": recent,
    }


# ── Team Overview Stats ───────────────────────────────────────────────────────

def get_team_stats(team_name: str) -> dict:
    matches = get_team_matches(team_name)   # raises ValueError if not found
    total   = len(matches)
    wins    = int((matches["winner"] == team_name).sum())
    losses  = total - wins

    score_stats = get_score_stats(team_name)

    # Map win rates
    map_record = {}
    if "map" in matches.columns:
        for map_name, group in matches.groupby("map"):
            mw = int((group["winner"] == team_name).sum())
            mt = len(group)
            map_record[map_name] = {
                "wins":    mw,
                "losses":  mt - mw,
                "win_pct": round(mw / mt * 100, 1),
            }

    # Last 5 matches
    last_5_cols = ["match_id", "date", "teamA", "teamB", "winner", "map", "scoreA", "scoreB"]
    available   = [c for c in last_5_cols if c in matches.columns]
    last_5      = matches[available].head(5).to_dict(orient="records")
    for m in last_5:
        if "date" in m and hasattr(m["date"], "isoformat"):
            m["date"] = m["date"].isoformat()

    return {
        "team":          team_name,
        "total_matches": total,
        "wins":          wins,
        "losses":        losses,
        "win_rate":      round(wins / total, 2) if total > 0 else 0.0,
        "score_stats":   score_stats,
        "map_record":    map_record,
        "last_5":        last_5,
    }


# ── Player Stats ──────────────────────────────────────────────────────────────

def get_player_stats(team_name: str) -> dict:
    """
    Returns all players for a team with their stats.
    Auto-detects 'team' column regardless of casing.
    Computes KDA if kills/deaths/assists are present.
    """
    df = load_players()

    # Find team column
    team_col = next((c for c in df.columns if c.lower() == "team"), None)
    if team_col is None:
        raise ValueError(f"No 'team' column found in players.csv. Columns: {list(df.columns)}")

    players = df[df[team_col] == team_name].copy()

    if players.empty:
        raise ValueError(f"No players found for team '{team_name}'")

    # Compute KDA ratio if kills/deaths/assists exist
    cols_lower = {c.lower(): c for c in players.columns}
    if all(k in cols_lower for k in ["kills", "deaths", "assists"]):
        k = cols_lower["kills"]
        d = cols_lower["deaths"]
        a = cols_lower["assists"]
        players["kda_ratio"] = players.apply(
            lambda r: round((r[k] + r[a]) / max(r[d], 1), 2), axis=1
        )

    # Sort by rating if available
    rating_col = next((c for c in players.columns if "rating" in c.lower()), None)
    if rating_col:
        players = players.sort_values(rating_col, ascending=False)

    return {
        "team":         team_name,
        "player_count": len(players),
        "players":      players.to_dict(orient="records"),
    }