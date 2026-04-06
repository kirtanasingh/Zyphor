import React, { useEffect, useState } from 'react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { TeamLogo } from '../ui/TeamLogo'
import { useTeams } from '../../data/useValorantData'
import { type Team } from '../../data/realData'
import { Trophy, Sparkles, Zap } from 'lucide-react'

interface BracketMatch {
  id: string
  teamA: Team | null
  teamB: Team | null
  winner: 'A' | 'B' | null
  probA: number | null
  probB: number | null
}

interface InteractiveBracketProps {
  autoFillEnabled?: boolean
}

export function InteractiveBracket({ autoFillEnabled = false }: InteractiveBracketProps) {
  const { teams } = useTeams('na')
  const safe = (idx: number) => teams[idx] ?? null

  // Initialize bracket structure
  const [semifinals, setSemifinals] = useState<BracketMatch[]>([
    {
      id: 'sf1',
      teamA: safe(0),
      teamB: safe(1),
      winner: null,
      probA: 67,
      probB: 33,
    },
    {
      id: 'sf2',
      teamA: safe(2),
      teamB: safe(3),
      winner: null,
      probA: 44,
      probB: 56,
    },
  ])

  const [finals, setFinals] = useState<BracketMatch>({
    id: 'final',
    teamA: null,
    teamB: null,
    winner: null,
    probA: null,
    probB: null,
  })

  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [autofilled, setAutofilled] = useState(false)

  useEffect(() => {
    if (!teams.length) return
    setSemifinals((current) => {
      if (current.every((m) => m.teamA && m.teamB)) return current
      return [
        { ...current[0], teamA: teams[0] ?? null, teamB: teams[1] ?? null },
        { ...current[1], teamA: teams[2] ?? null, teamB: teams[3] ?? null },
      ]
    })
  }, [teams])

  const handleMatchClick = (matchId: string) => {
    setSelectedMatch(selectedMatch === matchId ? null : matchId)
  }

  const autoFillBracket = () => {
    // Predict winners based on probabilities
    const newSemifinals = semifinals.map(match => ({
      ...match,
      winner: (match.probA || 0) > (match.probB || 0) ? ('A' as const) : ('B' as const),
    }))
    
    setSemifinals(newSemifinals)

    // Fill finals
    const sf1Winner = newSemifinals[0].winner === 'A' ? newSemifinals[0].teamA : newSemifinals[0].teamB
    const sf2Winner = newSemifinals[1].winner === 'A' ? newSemifinals[1].teamA : newSemifinals[1].teamB

    if (sf1Winner && sf2Winner) {
      const finalProbA = 58
      const finalProbB = 42
      
      setFinals({
        id: 'final',
        teamA: sf1Winner,
        teamB: sf2Winner,
        winner: finalProbA > finalProbB ? 'A' : 'B',
        probA: finalProbA,
        probB: finalProbB,
      })
    }

    setAutofilled(true)
  }

  const resetBracket = () => {
    setSemifinals(semifinals.map(m => ({ ...m, winner: null })))
    setFinals({ id: 'final', teamA: null, teamB: null, winner: null, probA: null, probB: null })
    setAutofilled(false)
  }

  return (
    <NeonCard clipTopRight accent="#FFD700">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: '#FFD700', textShadow: '0 0 15px #FFD70060' }}>
            TOURNAMENT BRACKET
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
            VALORANT CHAMPIONS 2025 · PLAYOFFS
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!autofilled ? (
            <button
              onClick={autoFillBracket}
              style={{
                padding: '8px 14px',
                background: `${C.toxicGreen}20`,
                border: `1px solid ${C.toxicGreen}`,
                borderRadius: '2px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: C.toxicGreen,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: `0 0 10px ${C.toxicGreen}40`,
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={12} />
              AUTO-FILL
            </button>
          ) : (
            <button
              onClick={resetBracket}
              style={{
                padding: '8px 14px',
                background: `${C.textMuted}20`,
                border: `1px solid ${C.textMuted}`,
                borderRadius: '2px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: C.textMuted,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              RESET
            </button>
          )}
        </div>
      </div>

      {/* Bracket visualization */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: '20px', alignItems: 'center' }}>
        {/* Semifinals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {semifinals.map((match, idx) => (
            <BracketMatchCard
              key={match.id}
              match={match}
              isSelected={selectedMatch === match.id}
              onClick={() => handleMatchClick(match.id)}
              roundLabel={`SF${idx + 1}`}
            />
          ))}
        </div>

        {/* Center - Connector lines and Finals */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', position: 'relative' }}>
          {/* Connector lines */}
          <svg width="120" height="200" style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)' }}>
            {/* SF1 to Finals */}
            <path
              d="M 0 40 L 40 40 L 40 100 L 80 100"
              stroke={semifinals[0].winner ? semifinals[0].winner === 'A' ? semifinals[0].teamA?.color : semifinals[0].teamB?.color : C.borderDefault}
              strokeWidth="2"
              fill="none"
              style={{ filter: semifinals[0].winner ? `drop-shadow(0 0 4px ${semifinals[0].winner === 'A' ? semifinals[0].teamA?.color : semifinals[0].teamB?.color})` : 'none' }}
            />
            {/* SF2 to Finals */}
            <path
              d="M 0 160 L 40 160 L 40 100 L 80 100"
              stroke={semifinals[1].winner ? semifinals[1].winner === 'A' ? semifinals[1].teamA?.color : semifinals[1].teamB?.color : C.borderDefault}
              strokeWidth="2"
              fill="none"
              style={{ filter: semifinals[1].winner ? `drop-shadow(0 0 4px ${semifinals[1].winner === 'A' ? semifinals[1].teamA?.color : semifinals[1].teamB?.color})` : 'none' }}
            />
          </svg>

          <div style={{ marginTop: '80px' }}>
            <Trophy size={20} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 8px #FFD700)', margin: '0 auto' }} />
          </div>
        </div>

        {/* Finals */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BracketMatchCard
            match={finals}
            isSelected={selectedMatch === 'final'}
            onClick={() => handleMatchClick('final')}
            roundLabel="FINAL"
            isFinals
          />
        </div>
      </div>
    </NeonCard>
  )
}

function BracketMatchCard({
  match,
  isSelected,
  onClick,
  roundLabel,
  isFinals = false,
}: {
  match: BracketMatch
  isSelected: boolean
  onClick: () => void
  roundLabel: string
  isFinals?: boolean
}) {
  const hasTeams = match.teamA && match.teamB
  const accentColor = isFinals ? '#FFD700' : C.neonBlue

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px',
        background: isSelected ? `${accentColor}10` : `${C.bgCardLighter}60`,
        border: `1px solid ${isSelected ? accentColor : C.borderDefault}`,
        borderRadius: '2px',
        cursor: hasTeams ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? `0 0 20px ${accentColor}40` : 'none',
        minWidth: '200px',
      }}
    >
      {/* Round label */}
      <div style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '9px',
        letterSpacing: '0.18em',
        color: C.textMuted,
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>{roundLabel}</span>
        {match.winner && (
          <Zap size={10} style={{ color: C.toxicGreen, filter: `drop-shadow(0 0 4px ${C.toxicGreen})` }} />
        )}
      </div>

      {hasTeams ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Team A */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px',
            background: match.winner === 'A' ? `${match.teamA!.color}20` : 'transparent',
            border: match.winner === 'A' ? `1px solid ${match.teamA!.color}40` : '1px solid transparent',
            borderRadius: '2px',
          }}>
            <TeamLogo name={match.teamA!.name} color={match.teamA!.color} size={18} shape="square" />
            <span style={{
              flex: 1,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '11px',
              fontWeight: match.winner === 'A' ? 700 : 600,
              letterSpacing: '0.08em',
              color: match.winner === 'A' ? match.teamA!.color : C.textSecondary,
            }}>
              {match.teamA!.name}
            </span>
            {match.probA !== null && (
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                fontWeight: 700,
                color: match.teamA!.color,
              }}>
                {match.probA}%
              </span>
            )}
          </div>

          {/* Team B */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px',
            background: match.winner === 'B' ? `${match.teamB!.color}20` : 'transparent',
            border: match.winner === 'B' ? `1px solid ${match.teamB!.color}40` : '1px solid transparent',
            borderRadius: '2px',
          }}>
            <TeamLogo name={match.teamB!.name} color={match.teamB!.color} size={18} shape="square" />
            <span style={{
              flex: 1,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '11px',
              fontWeight: match.winner === 'B' ? 700 : 600,
              letterSpacing: '0.08em',
              color: match.winner === 'B' ? match.teamB!.color : C.textSecondary,
            }}>
              {match.teamB!.name}
            </span>
            {match.probB !== null && (
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '10px',
                fontWeight: 700,
                color: match.teamB!.color,
              }}>
                {match.probB}%
              </span>
            )}
          </div>
        </div>
      ) : (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '10px',
          color: C.textMuted,
        }}>
          TBD
        </div>
      )}
    </div>
  )
}
