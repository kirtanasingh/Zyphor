import React, { useState } from 'react'
import { Zap, Lock, ChevronRight } from 'lucide-react'
import { C } from '../../theme'
import { TeamLogo } from '../ui/TeamLogo'
import type { Team } from '../../data/realData'

interface BracketMatch {
  id: string
  teamA: Team | null
  teamB: Team | null
  probA: number | null
  probB: number | null
  winner: 'A' | 'B' | null
  completed: boolean
  scoreA?: number | null
  scoreB?: number | null
  isLive?: boolean
  upcoming?: boolean
}

interface Round {
  id: string
  name: string
  matches: BracketMatch[]
}

interface BracketProps {
  rounds: Round[]
  tournament: string
  format: string
}

function MatchSlot({
  match,
  isTop,
  compact = false,
}: {
  match: BracketMatch
  isTop: boolean
  compact?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const team = isTop ? match.teamA : match.teamB
  const prob = isTop ? match.probA : match.probB
  const score = isTop ? match.scoreA : match.scoreB
  const isWinner = match.winner === (isTop ? 'A' : 'B')
  const isLoser = match.completed && !isWinner
  const teamColor = team?.color || C.textMuted

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: compact ? '6px 10px' : '8px 12px',
        background: isLoser
          ? 'rgba(10, 10, 15, 0.6)'
          : hovered
          ? `${teamColor}12`
          : `${C.bgCardLighter}80`,
        borderBottom: `1px solid ${C.borderDefault}`,
        opacity: isLoser ? 0.4 : 1,
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {isWinner && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '2px',
            background: '#39FF14',
            boxShadow: '0 0 8px #39FF14',
          }}
        />
      )}
      {/* Team logo */}
      {team ? (
        <TeamLogo name={team.name} color={team.color} size={24} shape="square" />
      ) : (
        <div
          style={{
            width: '24px',
            height: '24px',
            background: `${C.textMuted}15`,
            border: `1px dashed ${C.textMuted}40`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lock size={10} style={{ color: C.textMuted }} />
        </div>
      )}
      {/* Team name */}
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: compact ? '12px' : '13px',
          letterSpacing: '0.08em',
          color: team
            ? isWinner
              ? '#39FF14'
              : isLoser
              ? C.textMuted
              : C.textPrimary
            : C.textMuted,
          flex: 1,
          textShadow: isWinner ? '0 0 8px #39FF14AA' : undefined,
        }}
      >
        {team ? team.name : 'TBD'}
      </span>

      {/* Probability tag */}
      {prob !== null && !match.completed && (
        <span
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '10px',
            color: prob > 50 ? C.neonBlue : C.textMuted,
            background: prob > 50 ? `${C.neonBlue}12` : `${C.textMuted}08`,
            padding: '1px 5px',
            border: `1px solid ${prob > 50 ? C.neonBlue + '40' : C.textMuted + '25'}`,
            borderRadius: '2px',
            flexShrink: 0,
          }}
        >
          {prob}%
        </span>
      )}

      {/* Score */}
      {score !== null && score !== undefined && match.completed && (
        <span
          style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 800,
            fontSize: '13px',
            color: isWinner ? '#39FF14' : C.textMuted,
            textShadow: isWinner ? '0 0 8px #39FF14' : undefined,
            flexShrink: 0,
            minWidth: '12px',
            textAlign: 'center',
          }}
        >
          {score}
        </span>
      )}
    </div>
  )
}

function BracketMatchCard({
  match,
  showConnector = true,
}: {
  match: BracketMatch
  showConnector?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  const accentColor =
    match.isLive
      ? '#39FF14'
      : match.completed
      ? C.textMuted
      : C.neonBlue

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${
          match.isLive
            ? '#39FF1450'
            : hovered
            ? `${C.neonBlue}40`
            : `${C.borderDefault}`
        }`,
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        boxShadow: match.isLive
          ? '0 0 20px rgba(57,255,20,0.15)'
          : hovered
          ? `0 0 20px ${C.neonBlue}18`
          : 'none',
        animation: match.isLive ? 'none' : undefined,
        position: 'relative',
      }}
    >
      {/* Status bar at top */}
      {(match.isLive || match.upcoming) && (
        <div
          style={{
            height: '2px',
            background: match.isLive
              ? 'linear-gradient(90deg, #39FF1400, #39FF14, #39FF1400)'
              : `linear-gradient(90deg, ${C.neonBlue}00, ${C.neonBlue}, ${C.neonBlue}00)`,
            boxShadow: match.isLive ? '0 0 8px #39FF14' : `0 0 8px ${C.neonBlue}`,
          }}
        />
      )}

      <MatchSlot match={match} isTop />
      <div style={{ height: '1px', background: match.completed ? `${C.textMuted}20` : C.borderDefault }} />
      <MatchSlot match={match} isTop={false} />

      {/* Live badge */}
      {match.isLive && (
        <div
          style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            padding: '1px 6px',
            background: '#39FF1415',
            border: '1px solid #39FF1440',
            borderRadius: '2px',
          }}
        >
          <Zap size={8} style={{ color: '#39FF14' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', fontWeight: 700, color: '#39FF14', letterSpacing: '0.1em' }}>
            LIVE
          </span>
        </div>
      )}

      {/* Score overlay on completed */}
      {match.completed && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(10, 10, 15, 0.25)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

function BracketConnector({ count, heightRef }: { count: number; heightRef?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '32px',
        flexShrink: 0,
        flex: 1,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              flex: 1,
              borderRight: `1px solid ${C.neonBlue}35`,
              borderBottom: `1px solid ${C.neonBlue}35`,
            }}
          />
          <div
            style={{
              flex: 1,
              borderRight: `1px solid ${C.neonBlue}35`,
              borderTop: `1px solid ${C.neonBlue}35`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

export function TournamentBracket({ rounds, tournament, format }: BracketProps) {
  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '18px',
              color: C.textPrimary,
              letterSpacing: '0.1em',
              textShadow: `0 0 20px ${C.neonBlue}40`,
            }}
          >
            {tournament}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
            {format}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { color: '#39FF14', label: 'COMPLETED' },
            { color: C.neonBlue, label: 'UPCOMING' },
            { color: '#39FF14', label: 'LIVE', pulse: true },
          ].map(({ color, label, pulse }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 ${pulse ? 10 : 4}px ${color}`,
                  opacity: pulse ? undefined : label === 'COMPLETED' ? 0.4 : 1,
                }}
              />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.1em', color: C.textMuted }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bracket */}
      <div
        style={{
          display: 'flex',
          gap: '0',
          alignItems: 'stretch',
          overflowX: 'auto',
          paddingBottom: '12px',
        }}
      >
        {rounds.map((round, roundIdx) => (
          <React.Fragment key={round.id}>
            {/* Round column */}
            <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              {/* Round header */}
              <div
                style={{
                  padding: '8px 16px',
                  textAlign: 'center',
                  marginBottom: '16px',
                  background: `${C.neonBlue}08`,
                  border: `1px solid ${C.borderDefault}`,
                  borderRadius: '2px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: C.neonBlue,
                    textShadow: `0 0 8px ${C.neonBlue}60`,
                  }}
                >
                  {round.name}
                </span>
              </div>

              {/* Matches */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  justifyContent: 'space-around',
                  gap: '12px',
                  width: round.id === 'f' ? '260px' : '240px',
                }}
              >
                {round.matches.map((match) => (
                  <BracketMatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>

            {/* Connector between rounds */}
            {roundIdx < rounds.length - 1 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  marginTop: '46px',
                  flex: 'none',
                }}
              >
                <BracketConnector count={rounds[roundIdx].matches.length / 2} />
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Trophy / Winner */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '8px',
            marginTop: '46px',
            width: '80px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '36px',
              height: '1px',
              background: `${C.neonBlue}35`,
            }}
          />
          <div
            style={{
              marginTop: '-1px',
              padding: '12px',
              background: `${C.neonBlue}10`,
              border: `1px solid ${C.neonBlue}30`,
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              boxShadow: `0 0 20px ${C.neonBlue}15`,
            }}
          >
            <span style={{ fontSize: '20px' }}>🏆</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.15em', color: C.neonBlue, textShadow: `0 0 8px ${C.neonBlue}`, textAlign: 'center' }}>
              CHAMPION
            </span>
          </div>
        </div>
      </div>

      {/* Match details footer */}
      <div
        style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {[
          { label: 'TOTAL MATCHES', value: '7', sub: '3 COMPLETED' },
          { label: 'PREDICTION ACC', value: '85.7%', sub: '6/7 CORRECT' },
          { label: 'AVG CONFIDENCE', value: '68.4%', sub: 'ACROSS ALL' },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              padding: '12px 16px',
              background: C.bgCard,
              border: `1px solid ${C.borderDefault}`,
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.18em', color: C.textMuted }}>
              {label}
            </span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '20px', color: C.neonBlue, textShadow: `0 0 12px ${C.neonBlue}80` }}>
              {value}
            </span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
              {sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}