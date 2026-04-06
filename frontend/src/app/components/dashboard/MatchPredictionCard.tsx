import React, { useEffect, useState } from 'react'
import { Flame, TrendingDown, Minus, Map, Clock, Zap } from 'lucide-react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { TeamLogo } from '../ui/TeamLogo'
import type { Team } from '../../data/realData'

interface MapStat {
  map: string
  teamAWinRate: number
  teamBWinRate: number
  predicted?: boolean
}

interface MatchPredictionCardProps {
  teamA: Team
  teamB: Team
  probA: number
  probB: number
  round: string
  bestOf?: number
  mapPool: MapStat[]
  isLive?: boolean
  currentScore?: { a: number; b: number }
  currentMap?: string
  large?: boolean
}

function FormBadge({ form }: { form: 'HOT' | 'COLD' | 'NEUTRAL' }) {
  const config = {
    HOT: { color: '#FF4444', bg: 'rgba(255,68,68,0.12)', border: 'rgba(255,68,68,0.35)', icon: Flame, label: 'HOT' },
    COLD: { color: '#4488FF', bg: 'rgba(68,136,255,0.12)', border: 'rgba(68,136,255,0.35)', icon: TrendingDown, label: 'COLD' },
    NEUTRAL: { color: '#8888A8', bg: 'rgba(136,136,168,0.12)', border: 'rgba(136,136,168,0.35)', icon: Minus, label: 'NEUTRAL' },
  }
  const cfg = config[form]
  const Icon = cfg.icon
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 8px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '2px',
        boxShadow: `0 0 8px ${cfg.color}30`,
      }}
    >
      <Icon size={10} style={{ color: cfg.color }} />
      <span
        style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.12em',
          color: cfg.color,
          textShadow: `0 0 6px ${cfg.color}`,
        }}
      >
        {cfg.label}
      </span>
    </div>
  )
}

function MapWinBar({ label, rateA, rateB, colorA, colorB, predicted }: { label: string; rateA: number; rateB: number; colorA: string; colorB: string; predicted?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '70px', flexShrink: 0 }}>
        {predicted && (
          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 6px #39FF14', flexShrink: 0 }} />
        )}
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '0.08em', color: predicted ? C.textPrimary : C.textMuted }}>
          {label}
        </span>
      </div>
      {/* Team A rate */}
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: colorA, width: '30px', textAlign: 'right', flexShrink: 0 }}>
        {rateA}%
      </span>
      {/* Bar */}
      <div style={{ flex: 1, height: '4px', background: '#111128', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
        <div style={{ width: `${rateA}%`, height: '100%', background: colorA, boxShadow: `0 0 8px ${colorA}AA`, borderRadius: '2px 0 0 2px', opacity: predicted ? 1 : 0.4 }} />
        <div style={{ flex: 1 }} />
      </div>
      <div style={{ flex: 1, height: '4px', background: '#111128', borderRadius: '2px', overflow: 'hidden', display: 'flex', transform: 'scaleX(-1)' }}>
        <div style={{ width: `${rateB}%`, height: '100%', background: colorB, boxShadow: `0 0 8px ${colorB}AA`, borderRadius: '2px 0 0 2px', opacity: predicted ? 1 : 0.4 }} />
        <div style={{ flex: 1 }} />
      </div>
      <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: colorB, width: '30px', flexShrink: 0 }}>
        {rateB}%
      </span>
    </div>
  )
}

export function MatchPredictionCard({
  teamA,
  teamB,
  probA,
  probB,
  round,
  bestOf = 3,
  mapPool,
  isLive = false,
  currentScore,
  currentMap,
  large = false,
}: MatchPredictionCardProps) {
  const [animatedProb, setAnimatedProb] = useState(50)

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProb(probA), 300)
    return () => clearTimeout(timer)
  }, [probA])

  const winnerA = probA > probB

  return (
    <NeonCard clipTopRight accent={winnerA ? teamA.color : teamB.color} noPadding>
      {/* Header */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: `1px solid ${C.borderDefault}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `linear-gradient(90deg, ${C.bgCard}, ${C.bgCardLighter})`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>
            MATCH PREDICTION
          </span>
          <div style={{ width: '1px', height: '12px', background: C.borderDefault }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '0.12em', color: C.textSecondary }}>
            {round}
          </span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
            BO{bestOf}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentMap && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Map size={10} style={{ color: C.textMuted }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textSecondary }}>{currentMap}</span>
            </div>
          )}
          {isLive ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 8px', background: '#39FF1415', border: '1px solid #39FF1440', borderRadius: '2px' }}>
              <Zap size={9} style={{ color: '#39FF14' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '10px', letterSpacing: '0.15em', color: '#39FF14' }}>LIVE</span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={10} style={{ color: C.textMuted }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>18:00 UTC</span>
            </div>
          )}
        </div>
      </div>

      {/* Teams */}
      <div
        style={{
          padding: large ? '28px 24px' : '20px',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        {/* Team A */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <TeamLogo name={teamA.name} color={teamA.color} size={large ? 72 : 56} shape="hex" />
            <div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: large ? '26px' : '20px',
                  letterSpacing: '0.1em',
                  color: teamA.color,
                  textShadow: `0 0 15px ${teamA.color}60`,
                  lineHeight: 1,
                }}
              >
                {teamA.name}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', color: C.textMuted, marginTop: '2px', letterSpacing: '0.08em' }}>
                {teamA.region} · RANK #{teamA.rank}
              </div>
            </div>
          </div>
          <FormBadge form={teamA.form} />
          {currentScore && (
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '18px', color: teamA.color, textShadow: `0 0 12px ${teamA.color}` }}>
              {currentScore.a}
            </div>
          )}
        </div>

        {/* VS */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              fontSize: large ? '18px' : '14px',
              letterSpacing: '0.2em',
              color: C.textMuted,
            }}
          >
            VS
          </div>
        </div>

        {/* Team B */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', gap: '14px' }}>
            <TeamLogo name={teamB.name} color={teamB.color} size={large ? 72 : 56} shape="hex" />
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: large ? '26px' : '20px',
                  letterSpacing: '0.1em',
                  color: teamB.color,
                  textShadow: `0 0 15px ${teamB.color}60`,
                  lineHeight: 1,
                }}
              >
                {teamB.name}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', color: C.textMuted, marginTop: '2px', letterSpacing: '0.08em' }}>
                RANK #{teamB.rank} · {teamB.region}
              </div>
            </div>
          </div>
          <FormBadge form={teamB.form} />
          {currentScore && (
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '18px', color: teamB.color, textShadow: `0 0 12px ${teamB.color}` }}>
              {currentScore.b}
            </div>
          )}
        </div>
      </div>

      {/* Win Probability Bar */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>WIN PROBABILITY</span>
        </div>
        {/* Bar container */}
        <div
          style={{
            height: '28px',
            background: '#060610',
            border: `1px solid ${C.borderDefault}`,
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)',
          }}
        >
          {/* Team A fill */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${animatedProb}%`,
              background: `linear-gradient(90deg, ${teamA.color}80, ${teamA.color})`,
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `4px 0 16px ${teamA.color}80`,
            }}
          />
          {/* Team B fill */}
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: `${100 - animatedProb}%`,
              background: `linear-gradient(270deg, ${teamB.color}80, ${teamB.color})`,
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `-4px 0 16px ${teamB.color}80`,
            }}
          />
          {/* Divider */}
          <div
            style={{
              position: 'absolute',
              left: `${animatedProb}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#fff',
              boxShadow: '0 0 8px rgba(255,255,255,0.8)',
              transform: 'translateX(-1px)',
              transition: 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
          {/* Labels */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px' }}>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '12px', color: '#fff', textShadow: '0 0 8px rgba(0,0,0,0.8)' }}>
              {probA}%
            </span>
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '12px', color: '#fff', textShadow: '0 0 8px rgba(0,0,0,0.8)' }}>
              {probB}%
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: teamA.color, opacity: 0.8 }}>PREDICTED WIN</span>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>FAVORED</span>
        </div>
      </div>

      {/* Map Pool */}
      <div
        style={{
          padding: '14px 20px',
          borderTop: `1px solid ${C.borderDefault}`,
          background: `${C.bgCardLighter}80`,
        }}
      >
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '10px' }}>
          MAP POOL
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {mapPool.slice(0, 5).map((m) => (
            <MapWinBar
              key={m.map}
              label={m.map}
              rateA={m.teamAWinRate}
              rateB={m.teamBWinRate}
              colorA={teamA.color}
              colorB={teamB.color}
              predicted={m.predicted}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.1em', color: C.textMuted }}>
            ● PREDICTED MAPS
          </span>
        </div>
      </div>
    </NeonCard>
  )
}
