import React, { useState } from 'react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { type Team } from '../../data/realData'
import { Zap, BarChart3, Trophy } from 'lucide-react'

interface SimulateMatchProps {
  teamA: Team | null
  teamB: Team | null
  probA: number
  probB: number
}

interface SimulationResult {
  mapScores: Array<{ map: string; scoreA: number; scoreB: number; winner: 'A' | 'B' }>
  winnerA: number
  winnerB: number
  totalSimulations: number
}

export function SimulateMatch({ teamA, teamB, probA, probB }: SimulateMatchProps) {
  const [simulation, setSimulation] = useState<SimulationResult | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const runSimulation = () => {
    if (!teamA || !teamB) return

    setIsSimulating(true)
    
    // Simulate with a delay for effect
    setTimeout(() => {
      const maps = ['Bind', 'Haven', 'Ascent']
      const mapScores = maps.map(map => {
        // Use probabilities to determine winner
        const rand = Math.random() * 100
        const winner = rand < probA ? 'A' as const : 'B' as const
        
        // Generate scores (13-x format for Valorant)
        const winnerScore = 13
        const loserScore = Math.floor(Math.random() * 12) // 0-11
        
        return {
          map,
          scoreA: winner === 'A' ? winnerScore : loserScore,
          scoreB: winner === 'B' ? winnerScore : loserScore,
          winner,
        }
      })

      // Simulate 1000 matches for distribution
      const totalSims = 1000
      let aWins = 0
      
      for (let i = 0; i < totalSims; i++) {
        const rand = Math.random() * 100
        if (rand < probA) aWins++
      }

      setSimulation({
        mapScores,
        winnerA: aWins,
        winnerB: totalSims - aWins,
        totalSimulations: totalSims,
      })
      
      setIsSimulating(false)
    }, 800)
  }

  if (!teamA || !teamB) {
    return (
      <NeonCard>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Zap size={32} style={{ color: C.textMuted, margin: '0 auto 12px' }} />
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
            Select both teams to simulate match
          </div>
        </div>
      </NeonCard>
    )
  }

  return (
    <NeonCard clipTopRight accent={C.hotPurple}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: C.hotPurple, textShadow: `0 0 15px ${C.hotPurple}60` }}>
            MATCH SIMULATION
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
            RUN MONTE CARLO ANALYSIS
          </div>
        </div>
        
        <button
          onClick={runSimulation}
          disabled={isSimulating}
          style={{
            padding: '10px 18px',
            background: isSimulating ? `${C.hotPurple}20` : `${C.hotPurple}30`,
            border: `1px solid ${C.hotPurple}`,
            borderRadius: '2px',
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            color: C.hotPurple,
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: isSimulating ? 'none' : `0 0 15px ${C.hotPurple}40`,
          }}
        >
          <Zap size={14} style={{ animation: isSimulating ? 'pulse 1s infinite' : 'none' }} />
          {isSimulating ? 'SIMULATING...' : 'SIMULATE MATCH'}
        </button>
      </div>

      {simulation && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Map-by-Map Results */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <BarChart3 size={12} style={{ color: C.textMuted }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>
                MAP-BY-MAP OUTCOME
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {simulation.mapScores.map((result, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 14px',
                    background: `${C.bgCardLighter}60`,
                    border: `1px solid ${result.winner === 'A' ? teamA.color : teamB.color}30`,
                    borderRadius: '2px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div style={{
                        width: '4px',
                        height: '24px',
                        background: result.winner === 'A' ? teamA.color : teamB.color,
                        borderRadius: '2px',
                        boxShadow: `0 0 8px ${result.winner === 'A' ? teamA.color : teamB.color}`,
                      }} />
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', letterSpacing: '0.15em', color: C.textMuted, marginBottom: '2px' }}>
                          MAP {idx + 1} · {result.map}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: result.winner === 'A' ? teamA.color : C.textSecondary }}>
                            {teamA.name}
                          </span>
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '14px', fontWeight: 700, color: result.scoreA === 13 ? teamA.color : C.textMuted }}>
                            {result.scoreA}
                          </span>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>-</span>
                          <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '14px', fontWeight: 700, color: result.scoreB === 13 ? teamB.color : C.textMuted }}>
                            {result.scoreB}
                          </span>
                          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: result.winner === 'B' ? teamB.color : C.textSecondary }}>
                            {teamB.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {result.winner === 'A' && result.scoreA === 13 && (
                      <Trophy size={16} style={{ color: teamA.color, filter: `drop-shadow(0 0 6px ${teamA.color})` }} />
                    )}
                    {result.winner === 'B' && result.scoreB === 13 && (
                      <Trophy size={16} style={{ color: teamB.color, filter: `drop-shadow(0 0 6px ${teamB.color})` }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distribution */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Trophy size={12} style={{ color: C.textMuted }} />
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>
                WIN DISTRIBUTION ({simulation.totalSimulations} SIMULATIONS)
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Team A */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: teamA.color }}>
                    {teamA.name}
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', fontWeight: 700, color: teamA.color }}>
                    {Math.round((simulation.winnerA / simulation.totalSimulations) * 100)}% ({simulation.winnerA} wins)
                  </span>
                </div>
                <div style={{ height: '6px', background: '#060610', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(simulation.winnerA / simulation.totalSimulations) * 100}%`,
                    height: '100%',
                    background: teamA.color,
                    boxShadow: `0 0 10px ${teamA.color}80`,
                  }} />
                </div>
              </div>

              {/* Team B */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', color: teamB.color }}>
                    {teamB.name}
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', fontWeight: 700, color: teamB.color }}>
                    {Math.round((simulation.winnerB / simulation.totalSimulations) * 100)}% ({simulation.winnerB} wins)
                  </span>
                </div>
                <div style={{ height: '6px', background: '#060610', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(simulation.winnerB / simulation.totalSimulations) * 100}%`,
                    height: '100%',
                    background: teamB.color,
                    boxShadow: `0 0 10px ${teamB.color}80`,
                  }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </NeonCard>
  )
}
