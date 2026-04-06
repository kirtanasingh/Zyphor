import React, { useState, useEffect, useRef } from 'react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { TeamLogo } from '../ui/TeamLogo'
import { useTeams } from '../../data/useValorantData'
import { type Team } from '../../data/realData'
import { ChevronDown } from 'lucide-react'

interface MatchAnalyzerProps {
  teamA: Team | null
  teamB: Team | null
  onTeamAChange: (team: Team | null) => void
  onTeamBChange: (team: Team | null) => void
  probA: number
  probB: number
}

export function MatchAnalyzer({ teamA, teamB, onTeamAChange, onTeamBChange, probA, probB }: MatchAnalyzerProps) {
  const { teams } = useTeams('na')
  const [showTeamADropdown, setShowTeamADropdown] = useState(false)
  const [showTeamBDropdown, setShowTeamBDropdown] = useState(false)
  const dropdownRefA = useRef<HTMLDivElement>(null)
  const dropdownRefB = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRefA.current && !dropdownRefA.current.contains(event.target as Node)) {
        setShowTeamADropdown(false)
      }
      if (dropdownRefB.current && !dropdownRefB.current.contains(event.target as Node)) {
        setShowTeamBDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <NeonCard clipTopRight accent={C.neonBlue}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: C.neonBlue, textShadow: `0 0 15px ${C.neonBlue}60` }}>
            MATCH ANALYZER
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
            SELECT TEAMS TO ANALYZE
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Team A Selector */}
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '8px' }}>
            TEAM A
          </div>
          <div style={{ position: 'relative' }} ref={dropdownRefA}>
            <button
              onClick={() => setShowTeamADropdown(!showTeamADropdown)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: `${C.bgCardLighter}80`,
                border: `1px solid ${teamA ? teamA.color : C.borderDefault}`,
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {teamA ? (
                <>
                  <TeamLogo name={teamA.name} color={teamA.color} size={24} shape="square" />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', color: teamA.color }}>
                      {teamA.name}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
                      {teamA.region} · Rank #{teamA.rank}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
                  Select Team A
                </div>
              )}
              <ChevronDown size={16} style={{ color: C.textMuted }} />
            </button>

            {showTeamADropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: C.bgCard,
                border: `1px solid ${C.neonBlue}40`,
                borderRadius: '2px',
                boxShadow: C.glowMd,
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto',
              }}>
                {teams.filter(t => t.id !== teamB?.id).map(team => (
                  <button
                    key={team.id}
                    onClick={() => {
                      onTeamAChange(team)
                      setShowTeamADropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${C.borderDefault}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = `${C.bgCardLighter}80`}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <TeamLogo name={team.name} color={team.color} size={20} shape="square" />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', color: team.color }}>
                        {team.name}
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
                        {team.region} · #{team.rank}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* VS Divider with Probabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '0 20px' }}>
          <div style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '28px',
            fontWeight: 800,
            color: C.neonBlue,
            textShadow: `0 0 20px ${C.neonBlue}80`,
            letterSpacing: '0.1em',
          }}>
            VS
          </div>
          
          {teamA && teamB && (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '24px',
                  fontWeight: 800,
                  color: teamA.color,
                  textShadow: `0 0 20px ${teamA.color}80`,
                }}>
                  {probA}%
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '8px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
                  WIN PROB
                </div>
              </div>

              <div style={{
                width: '1px',
                height: '40px',
                background: `linear-gradient(to bottom, transparent, ${C.borderDefault}, transparent)`,
              }} />

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: '24px',
                  fontWeight: 800,
                  color: teamB.color,
                  textShadow: `0 0 20px ${teamB.color}80`,
                }}>
                  {probB}%
                </div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '8px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
                  WIN PROB
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Team B Selector */}
        <div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '8px' }}>
            TEAM B
          </div>
          <div style={{ position: 'relative' }} ref={dropdownRefB}>
            <button
              onClick={() => setShowTeamBDropdown(!showTeamBDropdown)}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: `${C.bgCardLighter}80`,
                border: `1px solid ${teamB ? teamB.color : C.borderDefault}`,
                borderRadius: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {teamB ? (
                <>
                  <TeamLogo name={teamB.name} color={teamB.color} size={24} shape="square" />
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.08em', color: teamB.color }}>
                      {teamB.name}
                    </div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
                      {teamB.region} · Rank #{teamB.rank}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
                  Select Team B
                </div>
              )}
              <ChevronDown size={16} style={{ color: C.textMuted }} />
            </button>

            {showTeamBDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: C.bgCard,
                border: `1px solid ${C.neonBlue}40`,
                borderRadius: '2px',
                boxShadow: C.glowMd,
                zIndex: 100,
                maxHeight: '300px',
                overflowY: 'auto',
              }}>
                {teams.filter(t => t.id !== teamA?.id).map(team => (
                  <button
                    key={team.id}
                    onClick={() => {
                      onTeamBChange(team)
                      setShowTeamBDropdown(false)
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `1px solid ${C.borderDefault}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = `${C.bgCardLighter}80`}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <TeamLogo name={team.name} color={team.color} size={20} shape="square" />
                    <div style={{ flex: 1, textAlign: 'left' }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '12px', letterSpacing: '0.08em', color: team.color }}>
                        {team.name}
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
                        {team.region} · #{team.rank}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Probability Bar */}
      {teamA && teamB && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', height: '8px', background: '#060610', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
            <div
              style={{
                width: `${probA}%`,
                height: '100%',
                background: `linear-gradient(to right, ${teamA.color}, ${teamA.color}DD)`,
                boxShadow: `0 0 10px ${teamA.color}80`,
                transition: 'width 0.3s ease',
              }}
            />
            <div
              style={{
                width: `${probB}%`,
                height: '100%',
                background: `linear-gradient(to left, ${teamB.color}, ${teamB.color}DD)`,
                boxShadow: `0 0 10px ${teamB.color}80`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
      )}
    </NeonCard>
  )
}