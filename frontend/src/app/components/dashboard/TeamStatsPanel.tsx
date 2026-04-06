import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Award, Target } from 'lucide-react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { TeamLogo } from '../ui/TeamLogo'
import { useTeams } from '../../data/useValorantData'
import { type Team } from '../../data/realData'

interface StatRowProps {
  label: string
  value: string
  rawValue: number
  maxValue: number
  color?: string
  highlight?: boolean
}

function StatRow({ label, value, rawValue, maxValue, color = C.neonBlue, highlight = false }: StatRowProps) {
  const [hovered, setHovered] = useState(false)
  const percentage = Math.min((rawValue / maxValue) * 100, 100)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '130px 1fr 70px',
        gap: '12px',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: `1px solid ${C.borderDefault}`,
        transition: 'all 0.2s ease',
        background: hovered ? `${color}06` : 'transparent',
      }}
    >
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: highlight ? C.textPrimary : C.textSecondary,
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {label}
      </span>
      <div
        style={{
          height: '4px',
          background: '#060610',
          border: `1px solid ${color}15`,
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            background: highlight
              ? `linear-gradient(90deg, ${color}80, ${color})`
              : `linear-gradient(90deg, ${color}50, ${color}80)`,
            boxShadow: highlight ? `0 0 8px ${color}AA, 0 0 16px ${color}40` : `0 0 4px ${color}60`,
            borderRadius: '2px',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '13px',
          color: highlight ? color : C.textPrimary,
          textShadow: highlight ? `0 0 10px ${color}AA` : undefined,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  )
}

function MapStatRow({ map, winRate, teamColor }: { map: string; winRate: number; teamColor: string }) {
  const ratingColor = winRate >= 75 ? '#39FF14' : winRate >= 60 ? C.neonBlue : winRate >= 50 ? '#FFD700' : '#FF4444'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 0',
        borderBottom: `1px solid ${C.borderDefault}`,
      }}
    >
      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: ratingColor, boxShadow: `0 0 6px ${ratingColor}`, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.08em', color: C.textSecondary, width: '70px', flexShrink: 0 }}>
        {map.toUpperCase()}
      </span>
      <div style={{ flex: 1, height: '3px', background: '#060610', border: `1px solid ${teamColor}15`, borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${winRate}%`,
            background: `linear-gradient(90deg, ${teamColor}60, ${teamColor})`,
            boxShadow: `0 0 6px ${teamColor}60`,
            borderRadius: '2px',
            transition: 'width 0.8s ease',
          }}
        />
      </div>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: ratingColor, textShadow: `0 0 6px ${ratingColor}80`, width: '36px', textAlign: 'right', flexShrink: 0 }}>
        {winRate}%
      </span>
    </div>
  )
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = { S: '#39FF14', A: C.neonBlue, B: '#FFD700', C: '#FF6B35' }
  const color = colors[tier] || C.textMuted
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '24px',
        height: '24px',
        background: `${color}15`,
        border: `1px solid ${color}50`,
        borderRadius: '2px',
        boxShadow: `0 0 8px ${color}30`,
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
      }}
    >
      <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', fontWeight: 800, color, textShadow: `0 0 8px ${color}` }}>
        {tier}
      </span>
    </div>
  )
}

export function TeamStatsPanel() {
  const { teams, loading } = useTeams('na')
  const [selectedTeamId, setSelectedTeamId] = useState('')

  if (loading) {
    return (
      <NeonCard>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
          Loading teams...
        </div>
      </NeonCard>
    )
  }

  if (!teams.length) {
    return (
      <NeonCard>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
          No team data available.
        </div>
      </NeonCard>
    )
  }

  const resolvedSelectedTeamId = selectedTeamId || teams[0].id
  const team = teams.find(t => t.id === resolvedSelectedTeamId) || teams[0]

  const streakPositive = team.streak.startsWith('W')
  const streakColor = streakPositive ? '#39FF14' : '#FF4444'
  const StreakIcon = streakPositive ? TrendingUp : TrendingDown

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px' }}>
      {/* Team selector */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '4px' }}>
          SELECT TEAM
        </div>
        {teams.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTeamId(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              background: selectedTeamId === t.id ? `${t.color}15` : `${C.bgCard}`,
              border: `1px solid ${selectedTeamId === t.id ? t.color + '50' : C.borderDefault}`,
              borderRadius: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              clipPath: selectedTeamId === t.id ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' : undefined,
              boxShadow: selectedTeamId === t.id ? `0 0 12px ${t.color}25` : undefined,
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: t.color,
                boxShadow: selectedTeamId === t.id ? `0 0 8px ${t.color}` : 'none',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '0.1em',
                color: selectedTeamId === t.id ? t.color : C.textSecondary,
                flex: 1,
                textAlign: 'left',
                textShadow: selectedTeamId === t.id ? `0 0 8px ${t.color}80` : undefined,
              }}
            >
              {t.name}
            </span>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '10px',
                color: C.textMuted,
              }}
            >
              #{t.rank}
            </span>
          </button>
        ))}
      </div>

      {/* Stats panel */}
      <NeonCard clipTopRight accent={team.color} noPadding>
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            background: `linear-gradient(135deg, ${team.color}10, ${C.bgCard})`,
            borderBottom: `1px solid ${team.color}25`,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <TeamLogo name={team.name} color={team.color} size={80} shape="hex" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '28px',
                  letterSpacing: '0.12em',
                  color: team.color,
                  textShadow: `0 0 20px ${team.color}80`,
                  lineHeight: 1,
                }}
              >
                {team.name}
              </span>
              <TierBadge tier={team.tier} />
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '14px', color: C.textSecondary, marginBottom: '10px' }}>
              {team.fullName}
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {[
                { label: 'REGION', value: team.region },
                { label: 'RANK', value: `#${team.rank}` },
                { label: 'STREAK', value: team.streak, color: streakColor },
                { label: 'H2H', value: `${team.h2h.wins}-${team.h2h.losses}` },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.18em', color: C.textMuted }}>
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Share Tech Mono', monospace",
                      fontSize: '13px',
                      color: color || C.textPrimary,
                      textShadow: color ? `0 0 8px ${color}80` : undefined,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Streak indicator */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '16px',
              background: `${streakColor}10`,
              border: `1px solid ${streakColor}30`,
              borderRadius: '2px',
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)',
            }}
          >
            <StreakIcon size={20} style={{ color: streakColor, filter: `drop-shadow(0 0 6px ${streakColor})` }} />
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '18px', color: streakColor, textShadow: `0 0 12px ${streakColor}` }}>
              {team.streak}
            </span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.12em', color: streakColor + 'AA' }}>
              STREAK
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          {/* Performance metrics */}
          <div style={{ padding: '20px 24px', borderRight: `1px solid ${C.borderDefault}` }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '12px' }}>
              PERFORMANCE METRICS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <StatRow label="WIN RATE" value={`${team.winRate}%`} rawValue={team.winRate} maxValue={100} color={team.color} highlight />
              <StatRow label="AVG KDA" value={team.avgKda.toFixed(2)} rawValue={team.avgKda} maxValue={2} color={C.neonBlue} />
              <StatRow label="MAP WIN RATE" value={`${team.mapWinRate}%`} rawValue={team.mapWinRate} maxValue={100} color={team.color} />
              <StatRow
                label="H2H WIN RATE"
                value={`${Math.round((team.h2h.wins / (team.h2h.wins + team.h2h.losses)) * 100)}%`}
                rawValue={team.h2h.wins}
                maxValue={team.h2h.wins + team.h2h.losses}
                color={C.neonBlue}
              />
              <StatRow label="FORM RATING" value="87.3" rawValue={87.3} maxValue={100} color="#39FF14" highlight />
            </div>
          </div>

          {/* Map performance */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '12px' }}>
              MAP PERFORMANCE
            </div>
            {team.mapStats.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {team.mapStats.map((ms) => (
                  <MapStatRow key={ms.map} map={ms.map} winRate={ms.winRate} teamColor={team.color} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[84, 79, 68, 61, 55].map((wr, i) => (
                  <MapStatRow
                    key={i}
                    map={['Bind', 'Haven', 'Ascent', 'Split', 'Fracture'][i]}
                    winRate={wr}
                    teamColor={team.color}
                  />
                ))}
              </div>
            )}

            {/* Bottom stats */}
            <div
              style={{
                marginTop: '16px',
                padding: '10px',
                background: `${team.color}08`,
                border: `1px solid ${team.color}20`,
                borderRadius: '2px',
                display: 'flex',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.15em', color: C.textMuted }}>BEST MAP</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: '#39FF14', marginTop: '2px' }}>
                  {team.mapStats[0]?.map || 'Bind'}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.15em', color: C.textMuted }}>WORST MAP</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '13px', color: '#FF4444', marginTop: '2px' }}>
                  {team.mapStats[team.mapStats.length - 1]?.map || 'Fracture'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </NeonCard>
    </div>
  )
}
