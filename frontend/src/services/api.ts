/**
 * api.ts — Zyphor API Service
 * All calls to the FastAPI backend at localhost:8000
 */

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TeamForm {
  form: 'Hot' | 'Warm' | 'Neutral' | 'Cold' | 'Freezing'
  wins: number
  losses: number
  win_rate: number
  avg_score_diff: number
  current_streak: string
  matches_checked: number
}

export interface FactorBreakdown {
  form_contribution: number
  h2h_contribution: number
  score_contribution: number
  recency_contribution: number
}

export interface PredictionResult {
  teamA: string
  teamB: string
  teamA_win_prob: number
  teamB_win_prob: number
  formA: TeamForm
  formB: TeamForm
  factor_breakdown: FactorBreakdown
  model: string
}

export interface SimulationResult {
  teamA: string
  teamB: string
  simulations: number
  teamA_wins: number
  teamB_wins: number
  teamA_win_pct: number
  teamB_win_pct: number
  confidence_interval_95: { lower: number; upper: number }
  teamA_max_streak: number
  teamB_max_streak: number
  recent_streak: string[]
  base_prediction: PredictionResult
}

export interface H2HMatch {
  match_id: number
  date: string
  teamA: string
  teamB: string
  winner: string
  map: string
  scoreA: number
  scoreB: number
}

export interface MapBreakdown {
  [map: string]: {
    teamA_wins: number
    teamB_wins: number
    total: number
    teamA_win_pct: number
  }
}

export interface H2HResult {
  teamA: string
  teamB: string
  total_matches: number
  teamA_wins: number
  teamB_wins: number
  teamA_win_pct: number
  teamB_win_pct: number
  map_breakdown: MapBreakdown
  recent_matches: H2HMatch[]
}

export interface ScoreStats {
  avg_score_for: number
  avg_score_against: number
  avg_score_diff: number
}

export interface MapRecord {
  [map: string]: { wins: number; losses: number; win_pct: number }
}

export interface TeamStatsResult {
  team: string
  total_matches: number
  wins: number
  losses: number
  win_rate: number
  score_stats: ScoreStats
  map_record: MapRecord
  last_5: H2HMatch[]
}

export interface Player {
  player_name: string
  team: string
  role: string
  agent: string
  kills: number
  deaths: number
  assists: number
  kda: number
  acs: number
  hs_pct: number
  rating: number
  kda_ratio?: number
}

export interface PlayerStatsResult {
  team: string
  player_count: number
  players: Player[]
}

export interface TeamsListResult {
  teams: string[]
  count: number
}

// ── Helpers ────────────────────────────────────────────────────────────────────

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? `API error ${res.status}`)
  }
  return res.json()
}

// ── API calls ──────────────────────────────────────────────────────────────────

export const api = {
  /** List all teams */
  getTeams: () =>
    request<TeamsListResult>('/teams'),

  /** Predict match outcome */
  predict: (teamA: string, teamB: string) =>
    request<PredictionResult>('/predict', {
      method: 'POST',
      body: JSON.stringify({ teamA, teamB, simulations: 1000 }),
    }),

  /** Monte Carlo simulation */
  simulate: (teamA: string, teamB: string, simulations = 1000) =>
    request<SimulationResult>('/simulate', {
      method: 'POST',
      body: JSON.stringify({ teamA, teamB, simulations }),
    }),

  /** Head-to-head stats */
  h2h: (teamA: string, teamB: string) =>
    request<H2HResult>(`/h2h?teamA=${encodeURIComponent(teamA)}&teamB=${encodeURIComponent(teamB)}`),

  /** Team overview + map record */
  teamStats: (team: string) =>
    request<TeamStatsResult>(`/team/${encodeURIComponent(team)}`),

  /** Player roster + stats */
  playerStats: (team: string) =>
    request<PlayerStatsResult>(`/players/${encodeURIComponent(team)}`),
}