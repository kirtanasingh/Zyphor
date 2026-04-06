import React, { useState, useEffect } from 'react'
import { C } from '../theme'
import { NeonCard } from '../components/ui/NeonCard'
import { TeamLogo } from '../components/ui/TeamLogo'
import { TrendingUp, TrendingDown, Target, Trophy, Calendar, Users } from 'lucide-react'
import { api, TeamStatsResult, PlayerStatsResult, H2HResult, Player } from '../../services/api'

type TabType = 'OVERVIEW' | 'PLAYER STATS' | 'MATCH HISTORY' | 'HEAD-TO-HEAD'

const TEAM_COLORS: Record<string, string> = {
  PHANTOM: '#00D4FF', NEXUS: '#FF6B35', VORTEX: '#9B59B6',
  APEX: '#39FF14',  SHADOW: '#FF4444', CIPHER: '#FFD700',
  PULSE: '#FF69B4', CORE: '#00CED1',
}
const TEAM_RANKS: Record<string, number> = {
  PHANTOM: 1, NEXUS: 2, VORTEX: 3, APEX: 4,
  SHADOW: 5, CIPHER: 6, PULSE: 7, CORE: 8,
}
const REGIONS: Record<string, string> = {
  PHANTOM: 'EMEA', NEXUS: 'EMEA', VORTEX: 'Americas',
  APEX: 'Americas', SHADOW: 'Pacific', CIPHER: 'Pacific',
  PULSE: 'EMEA', CORE: 'Americas',
}
const ALL_TEAMS = ['PHANTOM', 'NEXUS', 'VORTEX', 'APEX', 'SHADOW', 'CIPHER', 'PULSE', 'CORE']

function Skeleton({ h = 16, w = '100%' }: { h?: number; w?: string }) {
  return (
    <div style={{
      height: h, width: w,
      background: `linear-gradient(90deg, ${C.bgCard} 25%, ${C.bgCardLighter} 50%, ${C.bgCard} 75%)`,
      backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', borderRadius: 2,
    }} />
  )
}

// ── Overview ──────────────────────────────────────────────────────────────────
function OverviewTab({ team: teamName }: { team: string }) {
  const [stats, setStats]   = useState<TeamStatsResult | null>(null)
  const [loading, setLoad]  = useState(true)
  const color = TEAM_COLORS[teamName] ?? '#00D4FF'

  useEffect(() => {
    setLoad(true)
    api.teamStats(teamName).then(setStats).finally(() => setLoad(false))
  }, [teamName])

  if (loading) return (
    <NeonCard clipTopRight accent={color}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[80, 40, 60, 30, 50].map((w, i) => <Skeleton key={i} h={18} w={`${w}%`} />)}
      </div>
    </NeonCard>
  )
  if (!stats) return null

  const wins    = stats.wins
  const losses  = stats.losses
  const total   = stats.total_matches
  const winRate = Math.round(stats.win_rate * 100)
  const maps = (Object.entries(stats.map_record) as Array<[string, TeamStatsResult['map_record'][string]]>)
    .sort((a, b) => b[1].win_pct - a[1].win_pct)
  const bestMap = maps[0]
  const worstMap = maps[maps.length - 1]

  // Streak from last_5
  const last5 = stats.last_5
  let streakType: 'W' | 'L' | null = null
  let streakVal = 0
  for (const m of last5) {
    const won = m.winner === teamName
    const t   = won ? 'W' : 'L'
    if (streakType === null) { streakType = t; streakVal = 1 }
    else if (t === streakType) streakVal++
    else break
  }
  const streak      = streakType ? `${streakType}${streakVal}` : 'N/A'
  const streakColor = streakType === 'W' ? '#39FF14' : '#FF4444'

  return (
    <NeonCard clipTopRight accent={color} noPadding>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        background: `linear-gradient(135deg, ${color}10, ${C.bgCard})`,
        borderBottom: `1px solid ${color}25`,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <TeamLogo name={teamName} color={color} size={80} shape="hex" />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: '0.12em', color, textShadow: `0 0 20px ${color}80`, lineHeight: 1, marginBottom: 4 }}>
            {teamName}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 8 }}>
            {[
              { label: 'REGION',  value: REGIONS[teamName] ?? 'Global' },
              { label: 'RANK',    value: `#${TEAM_RANKS[teamName] ?? '?'}` },
              { label: 'STREAK',  value: streak, color: streakColor },
              { label: 'RECORD',  value: `${wins}W-${losses}L` },
            ].map(({ label, value, color: vc }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.18em', color: C.textMuted }}>{label}</span>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: vc ?? C.textPrimary, textShadow: vc ? `0 0 8px ${vc}80` : undefined }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Win rate circle-ish */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '16px', background: `${color}10`, border: `1px solid ${color}30`, borderRadius: 2,
        }}>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 28, color, textShadow: `0 0 16px ${color}` }}>{winRate}%</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.12em', color: `${color}AA` }}>WIN RATE</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {/* Score stats */}
        <div style={{ padding: '20px 24px', borderRight: `1px solid ${C.borderDefault}` }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: C.textMuted, marginBottom: 12 }}>
            SCORE STATISTICS
          </div>
          {[
            { label: 'WIN RATE',          value: `${winRate}%`,                                  raw: winRate,                     max: 100 },
            { label: 'AVG SCORE FOR',     value: stats.score_stats.avg_score_for.toFixed(1),      raw: stats.score_stats.avg_score_for,    max: 14 },
            { label: 'AVG SCORE AGAINST', value: stats.score_stats.avg_score_against.toFixed(1),  raw: stats.score_stats.avg_score_against, max: 14 },
            { label: 'AVG SCORE DIFF',    value: (stats.score_stats.avg_score_diff > 0 ? '+' : '') + stats.score_stats.avg_score_diff.toFixed(1), raw: stats.score_stats.avg_score_diff + 5, max: 10 },
          ].map(({ label, value, raw, max }) => {
            const pct = Math.min(Math.max((raw / max) * 100, 0), 100)
            return (
              <div key={label} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 60px', gap: 12, alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${C.borderDefault}` }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, letterSpacing: '0.12em', color: C.textSecondary }}>{label}</span>
                <div style={{ height: 4, background: '#060610', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, boxShadow: `0 0 6px ${color}60`, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: C.textPrimary, textAlign: 'right' }}>{value}</span>
              </div>
            )
          })}
        </div>

        {/* Map record */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: C.textMuted, marginBottom: 12 }}>
            MAP RECORD
          </div>
          {maps.slice(0, 6).map(([map, rec]) => {
            const rc = rec.win_pct >= 65 ? '#39FF14' : rec.win_pct >= 50 ? C.neonBlue : '#FF4444'
            return (
              <div key={map} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${C.borderDefault}` }}>
                <div style={{ width: 4, height: 4, borderRadius: '50%', background: rc, boxShadow: `0 0 6px ${rc}` }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, letterSpacing: '0.08em', color: C.textSecondary, width: 70 }}>{map.toUpperCase()}</span>
                <div style={{ flex: 1, height: 3, background: '#060610', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ width: `${rec.win_pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}60, ${color})`, boxShadow: `0 0 4px ${color}60`, transition: 'width 0.8s ease' }} />
                </div>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: rc, width: 40, textAlign: 'right' }}>{rec.win_pct}%</span>
              </div>
            )
          })}
          <div style={{ marginTop: 14, padding: '10px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 2, display: 'flex', gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: C.textMuted }}>BEST MAP</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 13, color: '#39FF14', marginTop: 2 }}>{bestMap?.[0] ?? '—'}</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.15em', color: C.textMuted }}>WORST MAP</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 13, color: '#FF4444', marginTop: 2 }}>{worstMap?.[0] ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </NeonCard>
  )
}

// ── Player Stats ──────────────────────────────────────────────────────────────
function PlayerStatsTab({ team: teamName }: { team: string }) {
  const [data, setData]    = useState<PlayerStatsResult | null>(null)
  const [loading, setLoad] = useState(true)
  const color = TEAM_COLORS[teamName] ?? '#00D4FF'

  useEffect(() => {
    setLoad(true)
    api.playerStats(teamName).then(setData).finally(() => setLoad(false))
  }, [teamName])

  const HEADERS = ['PLAYER', 'ROLE', 'AGENT', 'KDA', 'ACS', 'HS%', 'RATING']
  const COLS    = '160px 100px 100px 70px 70px 70px 70px'

  return (
    <NeonCard clipTopRight accent={color}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <Users size={18} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '0.12em', color, textShadow: `0 0 15px ${color}60` }}>PLAYER STATISTICS</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.15em', color: C.textMuted, marginTop: 2 }}>{teamName} · INDIVIDUAL PERFORMANCE</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4,5].map(i => <Skeleton key={i} h={40} />)}
        </div>
      ) : !data ? (
        <div style={{ color: C.textMuted, fontFamily: "'Barlow Condensed', sans-serif", padding: 20 }}>No player data available.</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, padding: '10px 14px', background: `${C.bgCardLighter}60`, borderRadius: 2, marginBottom: 8 }}>
            {HEADERS.map(h => <span key={h} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.18em', color: C.textMuted }}>{h}</span>)}
          </div>
          {data.players.map((p: Player, idx: number) => (
            <div
              key={p.player_name}
              style={{
                display: 'grid', gridTemplateColumns: COLS, gap: 12,
                padding: '12px 14px', borderBottom: idx < data.players.length - 1 ? `1px solid ${C.borderDefault}` : 'none',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${color}06`)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, background: `linear-gradient(135deg, ${color}30, ${color}50)`, border: `1px solid ${color}40`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, color }}>{p.player_name.slice(-2)}</span>
                </div>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 600, color: C.textPrimary }}>{p.player_name}</span>
              </div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textSecondary }}>{p.role}</span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textSecondary }}>{p.agent}</span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700, color: C.neonBlue }}>{p.kda}</span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: C.textPrimary }}>{p.acs}</span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: C.textPrimary }}>{(p.hs_pct * 100).toFixed(0)}%</span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700, color: p.rating >= 1.15 ? '#39FF14' : C.textPrimary }}>{p.rating.toFixed(2)}</span>
            </div>
          ))}
        </>
      )}
    </NeonCard>
  )
}

// ── Match History ─────────────────────────────────────────────────────────────
function MatchHistoryTab({ team: teamName }: { team: string }) {
  const [stats, setStats]  = useState<TeamStatsResult | null>(null)
  const [loading, setLoad] = useState(true)
  const color = TEAM_COLORS[teamName] ?? '#00D4FF'

  useEffect(() => {
    setLoad(true)
    api.teamStats(teamName).then(setStats).finally(() => setLoad(false))
  }, [teamName])

  return (
    <NeonCard clipTopRight accent={color}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <Calendar size={18} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '0.12em', color, textShadow: `0 0 15px ${color}60` }}>MATCH HISTORY</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.15em', color: C.textMuted, marginTop: 2 }}>{teamName} · RECENT RESULTS</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>{[1,2,3,4,5].map(i => <Skeleton key={i} h={40} />)}</div>
      ) : !stats ? null : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 140px 80px 90px 80px 80px', gap: 12, padding: '10px 14px', background: `${C.bgCardLighter}60`, borderRadius: 2, marginBottom: 8 }}>
            {['DATE', 'OPPONENT', 'RESULT', 'SCORE', 'MAP', 'DIFF'].map(h => (
              <span key={h} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.18em', color: C.textMuted }}>{h}</span>
            ))}
          </div>
          {stats.last_5.map((m, idx) => {
            const won = m.winner === teamName
            const rc  = won ? '#39FF14' : '#FF4444'
            const opp = m.teamA === teamName ? m.teamB : m.teamA
            const myScore  = m.teamA === teamName ? m.scoreA : m.scoreB
            const oppScore = m.teamA === teamName ? m.scoreB : m.scoreA
            const diff = myScore - oppScore
            const date = typeof m.date === 'string' ? m.date.slice(0, 10) : ''
            return (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '100px 140px 80px 90px 80px 80px', gap: 12, padding: '12px 14px', borderBottom: idx < stats.last_5.length - 1 ? `1px solid ${C.borderDefault}` : 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.background = `${color}06`)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textMuted }}>{date}</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: C.textSecondary }}>vs {opp}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 2, background: `${rc}20`, border: `1px solid ${rc}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, fontWeight: 700, color: rc }}>{won ? 'W' : 'L'}</span>
                  </div>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: rc }}>{won ? 'WIN' : 'LOSS'}</span>
                </div>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, fontWeight: 700, color: C.textPrimary }}>{myScore} – {oppScore}</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textSecondary }}>{m.map}</span>
                <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 12, color: diff > 0 ? '#39FF14' : '#FF4444' }}>{diff > 0 ? '+' : ''}{diff}</span>
              </div>
            )
          })}
        </>
      )}
    </NeonCard>
  )
}

// ── Head-to-Head ──────────────────────────────────────────────────────────────
function HeadToHeadTab({ team: teamName }: { team: string }) {
  const color = TEAM_COLORS[teamName] ?? '#00D4FF'
  const opponents = ALL_TEAMS.filter(t => t !== teamName)
  const [selected, setSelected] = useState(opponents[0])
  const [h2h, setH2H]           = useState<H2HResult | null>(null)
  const [loading, setLoad]      = useState(true)

  useEffect(() => {
    setLoad(true)
    api.h2h(teamName, selected).then(setH2H).finally(() => setLoad(false))
  }, [teamName, selected])

  return (
    <NeonCard clipTopRight accent={color}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <Target size={18} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: '0.12em', color, textShadow: `0 0 15px ${color}60` }}>HEAD-TO-HEAD</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: '0.15em', color: C.textMuted, marginTop: 2 }}>{teamName} · SELECT OPPONENT</div>
        </div>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          style={{ padding: '6px 12px', background: C.bgCard, border: `1px solid ${C.borderDefault}`, borderRadius: 2, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, color: C.textPrimary, cursor: 'pointer', outline: 'none' }}
        >
          {opponents.map(o => <option key={o} value={o} style={{ background: '#0a0a1a' }}>{o}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>{[1,2,3].map(i => <Skeleton key={i} h={40} />)}</div>
      ) : !h2h ? null : (
        <>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center', padding: '16px', background: `${C.bgCardLighter}40`, border: `1px solid ${C.borderDefault}`, borderRadius: 2, marginBottom: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 32, color, textShadow: `0 0 16px ${color}` }}>{h2h.teamA_wins}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color, letterSpacing: '0.1em', marginTop: 2 }}>{teamName}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: C.textMuted }}>{h2h.total_matches} MATCHES</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textMuted, marginTop: 4 }}>HEAD TO HEAD</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: 32, color: TEAM_COLORS[selected] ?? C.neonBlue, textShadow: `0 0 16px ${TEAM_COLORS[selected] ?? C.neonBlue}` }}>{h2h.teamB_wins}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: TEAM_COLORS[selected] ?? C.neonBlue, letterSpacing: '0.1em', marginTop: 2 }}>{selected}</div>
            </div>
          </div>

          {/* Win % bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ height: 6, background: '#060610', borderRadius: 3, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${h2h.teamA_win_pct}%`, height: '100%', background: color, transition: 'width 0.8s ease' }} />
              <div style={{ flex: 1, background: TEAM_COLORS[selected] ?? C.neonBlue }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color }}>{h2h.teamA_win_pct}%</span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: TEAM_COLORS[selected] ?? C.neonBlue }}>{h2h.teamB_win_pct}%</span>
            </div>
          </div>

          {/* Map breakdown */}
          {Object.keys(h2h.map_breakdown).length > 0 && (
            <>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: C.textMuted, marginBottom: 10 }}>MAP BREAKDOWN</div>
              {(Object.entries(h2h.map_breakdown) as Array<[string, H2HResult['map_breakdown'][string]]>).map(([map, mb]) => (
                <div key={map} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: `1px solid ${C.borderDefault}` }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, color: C.textSecondary, width: 70 }}>{map.toUpperCase()}</span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color, width: 20, textAlign: 'center' }}>{mb.teamA_wins}</span>
                  <div style={{ flex: 1, height: 3, background: '#060610', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
                    <div style={{ width: `${mb.teamA_win_pct}%`, height: '100%', background: color }} />
                    <div style={{ flex: 1, background: TEAM_COLORS[selected] ?? C.neonBlue }} />
                  </div>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: TEAM_COLORS[selected] ?? C.neonBlue, width: 20, textAlign: 'center' }}>{mb.teamB_wins}</span>
                </div>
                  ))}
            </>
          )}
        </>
      )}
    </NeonCard>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export function TeamsPage() {
  const [activeTab, setActiveTab]         = useState<TabType>('OVERVIEW')
  const [selectedTeam, setSelectedTeam]   = useState('PHANTOM')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '22px', letterSpacing: '0.12em', color: C.textPrimary, textShadow: `0 0 20px ${C.neonBlue}40` }}>
          TEAM ANALYSIS
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          DETAILED TEAM PERFORMANCE METRICS · LIVE DATA
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.borderDefault}` }}>
        {(['OVERVIEW', 'PLAYER STATS', 'MATCH HISTORY', 'HEAD-TO-HEAD'] as TabType[]).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '10px 20px', background: activeTab === tab ? `${C.neonBlue}12` : 'transparent', border: 'none', borderBottom: activeTab === tab ? `2px solid ${C.neonBlue}` : '2px solid transparent', cursor: 'pointer', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.12em', color: activeTab === tab ? C.neonBlue : C.textMuted, transition: 'all 0.2s ease', marginBottom: -1 }}>
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
        {/* Team selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: '0.2em', color: C.textMuted, marginBottom: 4 }}>SELECT TEAM</div>
          {ALL_TEAMS.map(t => {
            const tc = TEAM_COLORS[t] ?? '#00D4FF'
            return (
              <button key={t} onClick={() => setSelectedTeam(t)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: selectedTeam === t ? `${tc}15` : C.bgCard, border: `1px solid ${selectedTeam === t ? tc + '50' : C.borderDefault}`, borderRadius: 2, cursor: 'pointer', transition: 'all 0.2s', clipPath: selectedTeam === t ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' : undefined, boxShadow: selectedTeam === t ? `0 0 12px ${tc}25` : undefined }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: tc, boxShadow: selectedTeam === t ? `0 0 8px ${tc}` : 'none', flexShrink: 0 }} />
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.1em', color: selectedTeam === t ? tc : C.textSecondary, flex: 1, textAlign: 'left' }}>{t}</span>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, color: C.textMuted }}>#{TEAM_RANKS[t]}</span>
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'OVERVIEW'      && <OverviewTab     team={selectedTeam} />}
          {activeTab === 'PLAYER STATS'  && <PlayerStatsTab  team={selectedTeam} />}
          {activeTab === 'MATCH HISTORY' && <MatchHistoryTab team={selectedTeam} />}
          {activeTab === 'HEAD-TO-HEAD'  && <HeadToHeadTab   team={selectedTeam} />}
        </div>
      </div>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
    </div>
  )
}