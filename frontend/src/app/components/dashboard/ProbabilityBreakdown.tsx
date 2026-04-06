import React from 'react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { type Team } from '../../data/realData'
import { TrendingUp, Target, Users, Map as MapIcon, Activity } from 'lucide-react'

interface ProbabilityBreakdownProps {
  teamA: Team | null
  teamB: Team | null
  selectedMap: string
  formA: 'HOT' | 'NEUTRAL' | 'COLD'
  formB: 'HOT' | 'NEUTRAL' | 'COLD'
  playerPerformance: number
}

interface Factor {
  name: string
  icon: any
  contributionA: number
  contributionB: number
  color: string
}

export function ProbabilityBreakdown({
  teamA,
  teamB,
  selectedMap,
  formA,
  formB,
  playerPerformance,
}: ProbabilityBreakdownProps) {
  if (!teamA || !teamB) {
    return (
      <NeonCard>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Target size={32} style={{ color: C.textMuted, margin: '0 auto 12px' }} />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
            Select both teams to view probability breakdown
          </div>
        </div>
      </NeonCard>
    )
  }

  // Calculate factor contributions based on inputs
  const formModifierA = formA === 'HOT' ? 1.2 : formA === 'COLD' ? 0.8 : 1.0
  const formModifierB = formB === 'HOT' ? 1.2 : formB === 'COLD' ? 0.8 : 1.0
  
  // Base contributions
  const baseTeamStrength = { a: 30, b: 25 }
  const formContribution = { 
    a: 15 * formModifierA, 
    b: 15 * formModifierB 
  }
  
  // Map strength from team data
  const mapStatA = teamA.mapStats?.find(m => m.map === selectedMap)?.winRate || 65
  const mapStatB = teamB.mapStats?.find(m => m.map === selectedMap)?.winRate || 60
  const mapContribution = {
    a: (mapStatA / 100) * 20,
    b: (mapStatB / 100) * 20,
  }
  
  const playerContribution = {
    a: (playerPerformance / 100) * 15,
    b: ((100 - playerPerformance) / 100) * 15,
  }
  
  const h2hContribution = {
    a: (teamA.h2h.wins / (teamA.h2h.wins + teamA.h2h.losses)) * 20,
    b: (teamB.h2h.wins / (teamB.h2h.wins + teamB.h2h.losses)) * 20,
  }

  const factors: Factor[] = [
    {
      name: 'Team Form',
      icon: TrendingUp,
      contributionA: formContribution.a,
      contributionB: formContribution.b,
      color: '#FF6B35',
    },
    {
      name: 'Map Strength',
      icon: MapIcon,
      contributionA: mapContribution.a,
      contributionB: mapContribution.b,
      color: C.neonBlue,
    },
    {
      name: 'Player Stats',
      icon: Users,
      contributionA: playerContribution.a,
      contributionB: playerContribution.b,
      color: C.toxicGreen,
    },
    {
      name: 'Head-to-Head',
      icon: Target,
      contributionA: h2hContribution.a,
      contributionB: h2hContribution.b,
      color: C.hotPurple,
    },
    {
      name: 'Overall Rating',
      icon: Activity,
      contributionA: baseTeamStrength.a,
      contributionB: baseTeamStrength.b,
      color: '#FFD700',
    },
  ]

  const totalA = factors.reduce((sum, f) => sum + f.contributionA, 0)
  const totalB = factors.reduce((sum, f) => sum + f.contributionB, 0)

  return (
    <NeonCard clipTopRight accent="#FFD700">
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: '#FFD700', textShadow: '0 0 15px #FFD70060' }}>
          PROBABILITY BREAKDOWN
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          CONTRIBUTING FACTORS ANALYSIS
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {factors.map((factor) => {
          const Icon = factor.icon
          const percentA = (factor.contributionA / totalA) * 100
          const percentB = (factor.contributionB / totalB) * 100
          
          return (
            <div key={factor.name}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{
                  padding: '6px',
                  background: `${factor.color}15`,
                  border: `1px solid ${factor.color}30`,
                  borderRadius: '2px',
                }}>
                  <Icon size={12} style={{ color: factor.color, filter: `drop-shadow(0 0 4px ${factor.color})` }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', color: C.textSecondary }}>
                    {factor.name}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', fontWeight: 700, color: teamA.color }}>
                    {percentA.toFixed(1)}%
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', fontWeight: 700, color: teamB.color }}>
                    {percentB.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Dual bar visualization */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Team A bar */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    width: `${percentA}%`,
                    height: '6px',
                    background: `linear-gradient(to left, ${teamA.color}, ${teamA.color}80)`,
                    borderRadius: '2px',
                    boxShadow: `0 0 6px ${teamA.color}60`,
                  }} />
                </div>

                {/* Center divider */}
                <div style={{
                  width: '2px',
                  height: '6px',
                  background: `linear-gradient(to bottom, ${C.borderDefault}, transparent)`,
                }} />

                {/* Team B bar */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    width: `${percentB}%`,
                    height: '6px',
                    background: `linear-gradient(to right, ${teamB.color}, ${teamB.color}80)`,
                    borderRadius: '2px',
                    boxShadow: `0 0 6px ${teamB.color}60`,
                  }} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total Summary */}
      <div style={{
        marginTop: '20px',
        padding: '14px',
        background: `${C.bgCardLighter}60`,
        border: `1px solid ${C.borderDefault}`,
        borderRadius: '2px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '4px' }}>
              WEIGHTED PREDICTION
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: teamA.color, marginRight: '6px' }}>
                  {teamA.name}
                </span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px', fontWeight: 800, color: teamA.color, textShadow: `0 0 12px ${teamA.color}80` }}>
                  {Math.round((totalA / (totalA + totalB)) * 100)}%
                </span>
              </div>
              <div style={{ width: '1px', background: C.borderDefault }} />
              <div>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: teamB.color, marginRight: '6px' }}>
                  {teamB.name}
                </span>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '16px', fontWeight: 800, color: teamB.color, textShadow: `0 0 12px ${teamB.color}80` }}>
                  {Math.round((totalB / (totalA + totalB)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NeonCard>
  )
}
