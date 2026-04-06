// ============================================================
// src/api/zyphorApi.js
// Central API client — import this anywhere in your React app
// ============================================================

const BASE_URL = "http://127.0.0.1:8000";

async function apiCall(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ── API Functions ─────────────────────────────────────────────

/** GET all teams (for dropdowns) */
export const getTeams = () =>
  apiCall("/teams");

/** POST predict match outcome */
export const predictMatch = (teamA, teamB) =>
  apiCall("/predict", {
    method: "POST",
    body: JSON.stringify({ teamA, teamB }),
  });

/** POST run Monte Carlo simulation */
export const simulateMatch = (teamA, teamB, simulations = 1000) =>
  apiCall("/simulate", {
    method: "POST",
    body: JSON.stringify({ teamA, teamB, simulations }),
  });

/** GET head-to-head record + map breakdown */
export const getHeadToHead = (teamA, teamB) =>
  apiCall(`/h2h?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(teamB)}`);

/** GET team stats (wins, losses, map record, score stats) */
export const getTeamStats = (teamName) =>
  apiCall(`/team/${encodeURIComponent(teamName)}`);

/** GET player roster + stats */
export const getPlayerStats = (teamName) =>
  apiCall(`/players/${encodeURIComponent(teamName)}`);


// ============================================================
// src/hooks/usePrediction.js
// Custom React hook — handles loading/error state for you
// ============================================================

/*
import { useState, useCallback } from "react";
import { predictMatch, simulateMatch, getHeadToHead } from "../api/zyphorApi";

export function usePrediction() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const run = useCallback(async (teamA, teamB) => {
    if (!teamA || !teamB) return;
    setLoading(true);
    setError(null);
    try {
      // Run all three in parallel — much faster
      const [prediction, simulation, h2h] = await Promise.all([
        predictMatch(teamA, teamB),
        simulateMatch(teamA, teamB, 1000),
        getHeadToHead(teamA, teamB),
      ]);
      setData({ prediction, simulation, h2h });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, run };
}
*/


// ============================================================
// HOW TO USE IN YOUR COMPONENT:
// ============================================================

/*
import { usePrediction } from "../hooks/usePrediction";

function MatchPanel({ teamA, teamB }) {
  const { data, loading, error, run } = usePrediction();

  return (
    <div>
      <button onClick={() => run(teamA, teamB)} disabled={loading}>
        {loading ? "Predicting..." : "Predict"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <>
          <p>{data.prediction.teamA}: {data.prediction.teamA_win_prob * 100}%</p>
          <p>{data.prediction.teamB}: {data.prediction.teamB_win_prob * 100}%</p>

          <p>Simulation: {data.simulation.teamA_win_pct}% from {data.simulation.simulations} runs</p>
          <p>95% CI: {data.simulation.confidence_interval_95.lower}% – {data.simulation.confidence_interval_95.upper}%</p>

          <p>H2H: {data.h2h.teamA_wins} – {data.h2h.teamB_wins}</p>
        </>
      )}
    </div>
  );
}
*/