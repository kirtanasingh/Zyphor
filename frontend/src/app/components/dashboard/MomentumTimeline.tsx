import React, { useState } from 'react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { type Team } from '../../data/realData'
import { TrendingUp, Calendar } from 'lucide-react'

interface MomentumTimelineProps {
  team: Team | null
  label: string
}

interface MatchEvent {
  id: string
  opponent: string
  result: 'W' | 'L'
  score: string
  date: string
  form: 'HOT' | 'NEUTRAL' | 'COLD'
  map: string
}

// Generate mock match history
function generateMatchHistory(team: Team | null): MatchEvent[] {
  if (!team) return []
  
  const opponents = ['VORTEX', 'CIPHER', 'PULSE', 'APEX', 'CORE', 'NEXUS']
  const maps = ['Bind', 'Haven', 'Ascent', 'Split', 'Fracture']
  const results: ('W' | 'L')[] = team.streak.includes('W') 
    ? ['W', 'W', 'W', 'W', 'L', 'W', 'L', 'W'] 
    : ['L', 'L', 'W', 'L', 'W', 'W', 'L', 'L']
  
  return results.map((result, idx) => {
    const winScore = result === 'W' ? 13 : Math.floor(Math.random() * 12)
    const loseScore = result === 'L' ? 13 : Math.floor(Math.random() * 12)
    
    // Calculate form based on recent results
    const recentWins = results.slice(Math.max(0, idx - 2), idx + 1).filter(r => r === 'W').length
    let form: 'HOT' | 'NEUTRAL' | 'COLD' = 'NEUTRAL'
    if (recentWins >= 3) form = 'HOT'
    else if (recentWins === 0) form = 'COLD'
    
    return {
      id: `m${idx}`,
      opponent: opponents[idx % opponents.length],
      result,
      score: `${winScore}-${loseScore}`,
      date: `Mar ${26 - idx}`,
      form,
      map: maps[idx % maps.length],
    }
  }).reverse()
}

export function MomentumTimeline({ team, label }: MomentumTimelineProps) {
  const [hoveredMatch, setHoveredMatch] = useState<string | null>(null)
  const matches = generateMatchHistory(team)

  if (!team) {
    return (
      <NeonCard>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Calendar size={32} style={{ color: C.textMuted, margin: '0 auto 12px' }} />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
            Select {label.toLowerCase()} to view momentum timeline
          </div>
        </div>
      </NeonCard>
    )
  }

  return (
    <NeonCard>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: team.color, textShadow: `0 0 15px ${team.color}60` }}>
          MOMENTUM TIMELINE
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          {team.name} · LAST 8 MATCHES
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', padding: '20px 0' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '0',
          right: '0',
          height: '2px',
          background: `linear-gradient(to right, ${C.borderDefault}, ${team.color}40, ${C.borderDefault})`,
        }} />

        {/* Match nodes */}
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
          {matches.map((match, idx) => {
            const formColor = match.form === 'HOT' ? '#FF6B35' : match.form === 'COLD' ? '#4A90E2' : C.neonBlue
            const resultColor = match.result === 'W' ? C.toxicGreen : '#FF4444'
            const isHovered = hoveredMatch === match.id

            return (
              <div
                key={match.id}
                style={{ position: 'relative', flex: 1, display: 'flex', justifyContent: 'center' }}
                onMouseEnter={() => setHoveredMatch(match.id)}
                onMouseLeave={() => setHoveredMatch(null)}
              >
                {/* Node */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${formColor}, ${resultColor})`,
                  border: `2px solid ${isHovered ? team.color : formColor}`,
                  boxShadow: isHovered ? `0 0 20px ${team.color}80` : `0 0 10px ${formColor}60`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                }}>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#fff',
                    textShadow: '0 0 4px rgba(0,0,0,0.8)',
                  }}>
                    {match.result}
                  </div>
                </div>

                {/* Hover details */}
                {isHovered && (
                  <div style={{
                    position: 'absolute',
                    top: '-90px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: C.bgCard,
                    border: `1px solid ${team.color}60`,
                    borderRadius: '2px',
                    padding: '10px 12px',
                    minWidth: '140px',
                    boxShadow: `0 0 20px ${team.color}40`,
                    zIndex: 10,
                  }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginBottom: '4px' }}>
                      {match.date} · {match.map}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', fontWeight: 700, color: team.color, marginBottom: '2px' }}>
                      vs {match.opponent}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '14px', fontWeight: 700, color: resultColor }}>
                        {match.result === 'W' ? 'WIN' : 'LOSS'}
                      </span>
                      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: C.textSecondary }}>
                        {match.score}
                      </span>
                    </div>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: '9px',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      color: formColor,
                      background: `${formColor}20`,
                      padding: '2px 6px',
                      borderRadius: '2px',
                      textAlign: 'center',
                    }}>
                      FORM: {match.form}
                    </div>

                    {/* Arrow pointing down */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: `6px solid ${team.color}60`,
                    }} />
                  </div>
                )}

                {/* Date label */}
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: '9px',
                  color: C.textMuted,
                  whiteSpace: 'nowrap',
                }}>
                  {match.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Form indicator */}
      <div style={{
        marginTop: '30px',
        padding: '12px 14px',
        background: `${C.bgCardLighter}60`,
        border: `1px solid ${C.borderDefault}`,
        borderRadius: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={14} style={{ color: team.color }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: C.textSecondary }}>
            CURRENT FORM
          </span>
        </div>
        <div style={{
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: team.form === 'HOT' ? '#FF6B35' : team.form === 'COLD' ? '#4A90E2' : C.neonBlue,
          background: team.form === 'HOT' ? '#FF6B3520' : team.form === 'COLD' ? '#4A90E220' : `${C.neonBlue}20`,
          padding: '4px 10px',
          borderRadius: '2px',
          border: `1px solid ${team.form === 'HOT' ? '#FF6B35' : team.form === 'COLD' ? '#4A90E2' : C.neonBlue}40`,
        }}>
          {team.form}
        </div>
      </div>
    </NeonCard>
  )
}
