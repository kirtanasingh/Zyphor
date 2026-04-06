import React, { useState, useEffect, useCallback } from 'react'
import { C } from '../theme'
import { NeonCard } from '../components/ui/NeonCard'
import { WhatIfControls } from '../components/dashboard/WhatIfControls'
import { SimulateMatch } from '../components/dashboard/SimulateMatch'
import { ProbabilityBreakdown } from '../components/dashboard/ProbabilityBreakdown'
import { MomentumTimeline } from '../components/dashboard/MomentumTimeline'
import { InteractiveBracket } from '../components/dashboard/InteractiveBracket'
import { MatchAnalyzer } from '../components/dashboard/MatchAnalyzer'
import { Team } from '../data/realData'
import { api, PredictionResult, SimulationResult } from '../../services/api'
import { getTeams } from '../data/realData'

const TEAM_COLORS: Record<string, string> = {
  PHANTOM: '#00D4FF',
  NEXUS: '#FF6B35',
  VORTEX: '#9B59B6',
  APEX: '#39FF14',
  SHADOW: '#FF4444',
  CIPHER: '#FFD700',
  PULSE: '#FF69B4',
  CORE: '#00CED1',
}

function makeTeam(name: string, color: string = '#00D4FF'): Team {
  return {
    id: name.toLowerCase(),
    name,
    fullName: name,
    color,
    rank: 5,
    tier: 'B',
    region: 'Global',
    winRate: 50,
    avgKda: 1.2,
    mapWinRate: 50,
    streak: 'N/A',
    h2h: { wins: 0, losses: 0 },
    form: 'NEUTRAL',
    mapStats: [],
    probHistory: [],
    logo: '',
  }
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function Skeleton({ h = 20, w = '100%' }: { h?: number; w?: string }) {
  return (
    <div style={{
      height: h, width: w,
      background: `linear-gradient(90deg, ${C.bgCard} 25%, ${C.bgCardLighter} 50%, ${C.bgCard} 75%)`,
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      borderRadius: 2,
    }} />
  )
}

// ── Factor breakdown bar ──────────────────────────────────────────────────────
function FactorBar({
  label, valueA, valueB, colorA, colorB,
}: { label: string; valueA: number; valueB: number; colorA: string; colorB: string }) {
  const total = valueA + valueB || 1
  const pctA  = Math.round((valueA / total) * 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.15em', color: C.textMuted }}>
          {label}
        </span>
        <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 10, color: C.textMuted }}>
          {(valueA * 100).toFixed(1)}% vs {(valueB * 100).toFixed(1)}%
        </span>
      </div>
      <div style={{ height: 4, background: '#060610', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${pctA}%`, height: '100%', background: colorA, transition: 'width 0.6s ease' }} />
        <div style={{ flex: 1, height: '100%', background: colorB, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function DashboardPage() {
  const [teams, setTeams]             = useState<Team[]>([])
  const [backendTeams, setBackendTeams] = useState<string[]>([])
  const [teamAName, setTeamAName]     = useState('')
  const [teamBName, setTeamBName]     = useState('')
  const [prediction, setPrediction]   = useState<PredictionResult | null>(null)
  const [simulation, setSimulation]   = useState<SimulationResult | null>(null)
  const [loadingPred, setLoadingPred] = useState(false)
  const [loadingSim, setLoadingSimul] = useState(false)
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [error, setError]             = useState<string | null>(null)

  // What-if controls (kept local)
  const [formA, setFormA]                     = useState<'HOT' | 'NEUTRAL' | 'COLD'>('HOT')
  const [formB, setFormB]                     = useState<'HOT' | 'NEUTRAL' | 'COLD'>('NEUTRAL')
  const [selectedMap, setSelectedMap]         = useState('Bind')
  const [playerPerformance, setPlayerPerf]    = useState(65)

  // Load teams from backend and realData
  useEffect(() => {
    setLoadingTeams(true)
    setError(null)
    
    Promise.all([
      getTeams().catch(e => {
        console.error('[Dashboard] getTeams failed:', e)
        setError('Failed to load teams from realData')
        return []
      }),
      (async () => {
        try {
          console.log('[Dashboard] Calling api.getTeams()')
          const res = await api.getTeams()
          console.log('[Dashboard] api.getTeams response:', res)
          const teams = (res as any).teams || []
          console.log('[Dashboard] Extracted teams:', teams, 'count:', teams.length)
          return teams
        } catch (e) {
          console.error('[Dashboard] api.getTeams failed:', e)
          setError('Failed to fetch teams from backend: ' + (e instanceof Error ? e.message : String(e)))
          return []
        }
      })(),
    ]).then(([realDataTeams, backendTeamNames]) => {
      console.log('[Dashboard] Promise.all resolved. realDataTeams:', realDataTeams.length, 'backendTeams:', backendTeamNames.length)
      setTeams(realDataTeams)
      setBackendTeams(backendTeamNames)
      // Set defaults
      if (backendTeamNames.length >= 2) {
        console.log('[Dashboard] Setting default teams:', backendTeamNames[0], 'vs', backendTeamNames[1])
        setTeamAName(backendTeamNames[0])
        setTeamBName(backendTeamNames[1])
      } else if (backendTeamNames.length === 0) {
        console.warn('[Dashboard] No teams loaded!')
        setError('No teams available from backend')
      }
      setLoadingTeams(false)
    })
  }, [])

  // Run prediction when teams change
  const runPrediction = useCallback(async () => {
    if (!teamAName || !teamBName || teamAName === teamBName) return
    setLoadingPred(true)
    setError(null)
    try {
      const pred = await api.predict(teamAName, teamBName)
      setPrediction(pred)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Prediction failed')
    } finally {
      setLoadingPred(false)
    }
  }, [teamAName, teamBName])

  const runSimulation = useCallback(async () => {
    if (!teamAName || !teamBName || teamAName === teamBName) return
    setLoadingSimul(true)
    try {
      const sim = await api.simulate(teamAName, teamBName, 1000)
      setSimulation(sim)
    } catch {
      // simulation errors are non-critical
    } finally {
      setLoadingSimul(false)
    }
  }, [teamAName, teamBName])

  const teamA = teams.find(t => t.name === teamAName) || makeTeam(teamAName, TEAM_COLORS[teamAName] || '#00D4FF')
  const teamB = teams.find(t => t.name === teamBName) || makeTeam(teamBName, TEAM_COLORS[teamBName] || '#FF6B35')

  // Enrich teamA/B with live win_rate from prediction form data
  if (prediction) {
    teamA.winRate    = Math.round(prediction.formA.win_rate * 100)
    teamA.streak     = prediction.formA.current_streak
    teamB.winRate    = Math.round(prediction.formB.win_rate * 100)
    teamB.streak     = prediction.formB.current_streak
  }

  const probA = prediction ? Math.round(prediction.teamA_win_prob * 100) : 50
  const probB = prediction ? Math.round(prediction.teamB_win_prob * 100) : 50

  const colorA = TEAM_COLORS[teamAName] ?? '#00D4FF'
  const colorB = TEAM_COLORS[teamBName] ?? '#FF6B35'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page title */}
      <div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '22px', letterSpacing: '0.12em', color: C.textPrimary, textShadow: `0 0 20px ${C.neonBlue}40` }}>
          MATCH PREDICTION SUITE
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          BAYESIAN · MARKOV CHAIN · MONTE CARLO — LIVE DATA
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div style={{ padding: '10px 16px', background: '#FF444415', border: '1px solid #FF444440', borderRadius: 2, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: '#FF4444' }}>
          ⚠ {error} — is the backend running on port 8000?
        </div>
      )}

      {/* Team selector */}
      <NeonCard clipTopRight accent={C.neonBlue}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: 12 }}>
          SELECT MATCHUP
        </div>
        {loadingTeams ? (
          <div style={{ padding: '10px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: C.textMuted }}>
            Loading teams...
          </div>
        ) : backendTeams.length === 0 ? (
          <div style={{ padding: '10px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: '#FF4444' }}>
            ⚠ No teams loaded. Check console for errors.
          </div>
        ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Team A */}
          <select
            value={teamAName}
            onChange={e => setTeamAName(e.target.value)}
            style={{
              flex: 1, padding: '10px 14px',
              background: `${teamA.color}10`, border: `1px solid ${teamA.color}40`, borderRadius: 2,
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14,
              letterSpacing: '0.1em', color: teamA.color, cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="">-- Select Team A --</option>
            {backendTeams
              .filter(t => t !== teamBName)
              .map(t => <option key={t} value={t} style={{ background: '#0a0a1a', color: '#fff' }}>{t}</option>)}
          </select>

          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 14, color: C.textMuted, fontWeight: 700 }}>VS</div>

          {/* Team B */}
          <select
            value={teamBName}
            onChange={e => setTeamBName(e.target.value)}
            style={{
              flex: 1, padding: '10px 14px',
              background: `${teamB.color}10`, border: `1px solid ${teamB.color}40`, borderRadius: 2,
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 14,
              letterSpacing: '0.1em', color: teamB.color, cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="">-- Select Team B --</option>
            {backendTeams
              .filter(t => t !== teamAName)
              .map(t => <option key={t} value={t} style={{ background: '#0a0a1a', color: '#fff' }}>{t}</option>)}
          </select>

          <button
            onClick={() => { runPrediction(); runSimulation() }}
            disabled={loadingPred || !teamAName || !teamBName}
            style={{
              padding: '10px 20px',
              background: loadingPred ? `${C.neonBlue}20` : `${C.neonBlue}25`,
              border: `1px solid ${C.neonBlue}50`,
              borderRadius: 2, cursor: loadingPred || !teamAName || !teamBName ? 'not-allowed' : 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
              fontSize: 12, letterSpacing: '0.15em', color: C.neonBlue,
              transition: 'all 0.2s',
              boxShadow: loadingPred ? 'none' : `0 0 12px ${C.neonBlue}30`,
            }}
          >
            {loadingPred ? 'PREDICTING…' : 'PREDICT'}
          </button>
        </div>
        )}
      </NeonCard>

      {/* Probability result */}
      {loadingPred ? (
        <NeonCard clipTopRight accent={C.neonBlue}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Skeleton h={32} w="60%" />
            <Skeleton h={8} />
            <Skeleton h={16} w="40%" />
          </div>
        </NeonCard>
      ) : prediction && (
        <NeonCard clipTopRight accent={teamA.color}>
          {/* Win prob bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 22, color: teamA.color, textShadow: `0 0 16px ${teamA.color}80` }}>
                {probA}%
              </span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.2em', color: C.textMuted, alignSelf: 'center' }}>
                WIN PROBABILITY
              </span>
              <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 22, color: teamB.color, textShadow: `0 0 16px ${teamB.color}80` }}>
                {probB}%
              </span>
            </div>
            <div style={{ height: 8, background: '#060610', borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${probA}%`, height: '100%', background: `linear-gradient(90deg, ${teamA.color}80, ${teamA.color})`, transition: 'width 0.8s ease', boxShadow: `0 0 8px ${teamA.color}` }} />
              <div style={{ flex: 1, background: `linear-gradient(90deg, ${teamB.color}, ${teamB.color}80)`, boxShadow: `0 0 8px ${teamB.color}` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <div>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: teamA.color }}>
                  {teamAName}
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textMuted, marginLeft: 8 }}>
                  FORM: {prediction.formA.form.toUpperCase()} · STREAK: {prediction.formA.current_streak}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textMuted, marginRight: 8 }}>
                  FORM: {prediction.formB.form.toUpperCase()} · STREAK: {prediction.formB.current_streak}
                </span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.1em', color: teamB.color }}>
                  {teamBName}
                </span>
              </div>
            </div>
          </div>

          {/* Factor breakdown */}
          <div style={{ borderTop: `1px solid ${C.borderDefault}`, paddingTop: 16 }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: 12 }}>
              FACTOR BREAKDOWN (MARKOV MULTI-FACTOR MODEL)
            </div>
            <FactorBar label="FORM (40%)"     valueA={prediction.factor_breakdown.form_contribution}    valueB={0.40 - prediction.factor_breakdown.form_contribution}    colorA={teamA.color} colorB={teamB.color} />
            <FactorBar label="H2H (25%)"      valueA={prediction.factor_breakdown.h2h_contribution}     valueB={0.25 - prediction.factor_breakdown.h2h_contribution}     colorA={teamA.color} colorB={teamB.color} />
            <FactorBar label="SCORE DIFF (20%)" valueA={prediction.factor_breakdown.score_contribution} valueB={0.20 - prediction.factor_breakdown.score_contribution}   colorA={teamA.color} colorB={teamB.color} />
            <FactorBar label="RECENCY (15%)"  valueA={prediction.factor_breakdown.recency_contribution} valueB={0.15 - prediction.factor_breakdown.recency_contribution} colorA={teamA.color} colorB={teamB.color} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: C.textMuted }}>
              MODEL: {prediction.model.toUpperCase()}
            </span>
          </div>
        </NeonCard>
      )}

      {/* What-If Controls */}
      <WhatIfControls
        teamA={teamA}
        teamB={teamB}
        formA={formA}
        formB={formB}
        selectedMap={selectedMap}
        playerPerformance={playerPerformance}
        onFormAChange={setFormA}
        onFormBChange={setFormB}
        onMapChange={setSelectedMap}
        onPlayerPerformanceChange={setPlayerPerf}
      />

      {/* Simulation + Momentum */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Monte Carlo results */}
          {loadingSim ? (
            <NeonCard clipTopRight accent={C.neonBlue}>
              <Skeleton h={120} />
            </NeonCard>
          ) : simulation && (
            <NeonCard clipTopRight accent={colorA}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: 14 }}>
                MONTE CARLO SIMULATION · {simulation.simulations.toLocaleString()} RUNS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  { label: teamAName, wins: simulation.teamA_wins, pct: simulation.teamA_win_pct, color: colorA },
                  { label: teamBName, wins: simulation.teamB_wins, pct: simulation.teamB_win_pct, color: colorB },
                ].map(({ label, wins, pct, color }) => (
                  <div key={label} style={{ padding: '12px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 2 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.1em', color, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 24, color, textShadow: `0 0 12px ${color}80` }}>{pct}%</div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textMuted, marginTop: 2 }}>{wins} wins</div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '10px 14px', background: `${C.bgCardLighter}60`, border: `1px solid ${C.borderDefault}`, borderRadius: 2, display: 'flex', gap: 20 }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: C.textMuted }}>95% CONFIDENCE</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: C.textPrimary, marginTop: 2 }}>
                    {simulation.confidence_interval_95.lower}% – {simulation.confidence_interval_95.upper}%
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: C.textMuted }}>MAX STREAK {teamAName}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: colorA, marginTop: 2 }}>{simulation.teamA_max_streak}</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: C.textMuted }}>MAX STREAK {teamBName}</div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: colorB, marginTop: 2 }}>{simulation.teamB_max_streak}</div>
                </div>
              </div>
              {/* Streak visual — last 20 sims */}
              <div style={{ marginTop: 12, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                {simulation.recent_streak.map((winner: string, i: number) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: 1,
                    background: winner === teamAName ? colorA : colorB,
                    opacity: 0.7 + (i / simulation.recent_streak.length) * 0.3,
                  }} />
                ))}
              </div>
            </NeonCard>
          )}

          <SimulateMatch teamA={teamA} teamB={teamB} probA={probA} probB={probB} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <MomentumTimeline team={teamA} label="TEAM A" />
          <MomentumTimeline team={teamB} label="TEAM B" />
        </div>
      </div>

      <InteractiveBracket />

      {/* Shimmer keyframe */}
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )
}