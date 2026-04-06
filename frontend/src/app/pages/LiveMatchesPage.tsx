import React, { useEffect } from 'react'
import { Zap } from 'lucide-react'
import { C } from '../theme'
import { MatchPredictionCard } from '../components/dashboard/MatchPredictionCard'
import { useValorantData, calcProbability } from '../data/useValorantData'

export function LiveMatchesPage() {
  const { live: liveMatches, loading, error } = useValorantData('na')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '22px', letterSpacing: '0.12em', color: C.textPrimary, textShadow: `0 0 20px ${C.neonBlue}40` }}>
            LIVE MATCHES
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
            REAL-TIME MATCH TRACKING · CHAMPIONS 2025
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#39FF1415', border: '1px solid #39FF1440', borderRadius: '2px', marginLeft: 'auto' }}>
          <Zap size={12} style={{ color: '#39FF14' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '0.15em', color: '#39FF14' }}>
            {liveMatches.length} LIVE NOW
          </span>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#FF444515',
          border: '1px solid #FF4445',
          borderRadius: '2px',
          color: '#FF4445',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '12px',
        }}>
          ⚠ Failed to fetch live matches: {error}
        </div>
      )}

      {loading && !liveMatches.length ? (
        <div style={{
          textAlign: 'center',
          padding: '80px',
          background: C.bgCard,
          border: `1px solid ${C.borderDefault}`,
          borderRadius: '2px',
        }}>
          <div style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>
            <Zap size={32} style={{ color: C.neonBlue }} />
          </div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px', color: C.textMuted, letterSpacing: '0.1em', marginTop: '16px' }}>
            LOADING LIVE MATCHES...
          </div>
        </div>
      ) : liveMatches.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
          {liveMatches.map((match) => {
            const { probA, probB } = calcProbability(match.teamA, match.teamB)
            return (
              <MatchPredictionCard
                key={match.id}
                teamA={match.teamA}
                teamB={match.teamB}
                probA={probA}
                probB={probB}
                round={match.round}
                mapPool={[{ map: match.currentMap, teamAWinRate: 50, teamBWinRate: 50 }]}
                isLive={true}
              />
            )
          })}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '80px',
          background: C.bgCard,
          border: `1px solid ${C.borderDefault}`,
          borderRadius: '2px',
        }}>
          <Zap size={32} style={{ color: C.textMuted, marginBottom: '16px' }} />
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px', color: C.textMuted, letterSpacing: '0.1em' }}>
            NO LIVE MATCHES
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', color: C.textMuted, marginTop: '8px' }}>
            Check back soon for live match coverage
          </div>
        </div>
      )}
    </div>
  )
}
