"""
main.py — Zyphor Esports Prediction API

Routes:
  GET  /                          → health check
  POST /predict                   → match prediction (multi-factor)
  POST /simulate                  → Monte Carlo simulation (1000 runs)
  GET  /h2h?teamA=X&teamB=Y       → head-to-head stats + map breakdown
  GET  /team/{name}               → team overview + map record + score stats
  GET  /players/{name}            → player roster + stats + KDA
  GET  /teams                     → list all known teams
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from services.prediction_service import predict_match, simulate_match
from services.stats_service import get_head_to_head, get_team_stats, get_player_stats
from utils.preprocess import load_matches, load_teams

app = FastAPI(
    title="Zyphor Esports Prediction API",
    version="2.0.0",
    description="Multi-factor esports match prediction using Markov form model",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ─────────────────────────────────────────────────────────────

class MatchRequest(BaseModel):
    teamA:       str = Field(..., example="Team Liquid")
    teamB:       str = Field(..., example="Navi")
    simulations: int = Field(default=1000, ge=100, le=10000)


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def health():
    return {"status": "ok", "message": "Zyphor API running ✅", "version": "2.0.0"}


@app.post("/predict", tags=["Prediction"])
def predict(req: MatchRequest):
    """
    Predict match outcome using multi-factor Markov model.
    Factors: form (40%), H2H (25%), score diff (20%), recency (15%).
    """
    try:
        return predict_match(req.teamA, req.teamB)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")


@app.post("/simulate", tags=["Prediction"])
def simulate(req: MatchRequest):
    """
    Run N Monte Carlo simulations. Returns win %, max streaks, confidence interval.
    """
    try:
        return simulate_match(req.teamA, req.teamB, req.simulations)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {e}")


@app.get("/h2h", tags=["Stats"])
def head_to_head(
    teamA: str = Query(..., example="Team Liquid"),
    teamB: str = Query(..., example="Navi"),
):
    """Head-to-head record + per-map breakdown + last 10 matches."""
    try:
        return get_head_to_head(teamA, teamB)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/team/{team_name}", tags=["Stats"])
def team_stats(team_name: str):
    """Overall win/loss, score stats, map record, last 5 matches."""
    try:
        return get_team_stats(team_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/players/{team_name}", tags=["Stats"])
def player_stats(team_name: str):
    """Player roster with stats. KDA auto-computed if kills/deaths/assists exist."""
    try:
        return get_player_stats(team_name)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/teams", tags=["Stats"])
def list_teams():
    """Returns all unique team names found in matches.csv."""
    try:
        df = load_matches()
        teams = sorted(set(df["teamA"].tolist() + df["teamB"].tolist()))
        return {"teams": teams, "count": len(teams)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))