import React, { useState } from 'react'
import { Filter } from 'lucide-react'
import { C } from '../theme'
import { MatchPredictionCard } from '../components/dashboard/MatchPredictionCard'
import { useValorantData, calcProbability } from '../data/useValorantData'

const FILTERS = ['ALL', 'LIVE', 'UPCOMING', 'COMPLETED']

export function PredictionsPage() {
  const [activeFilter, setActiveFilter] = useState('ALL')
  const { live, upcoming, results, loading, error } = useValorantData('na')

  const filtered = (() => {
    const allMatches = [
      ...live.map(m => ({ ...m, isLive: true, type: 'LIVE' })),
      ...upcoming.map(m => ({ ...m, isLive: true, type: 'UPCOMING' })),
      ...results.map(m => ({ ...m, isLive: false, type: 'COMPLETED' })),
    ]
    
    if (activeFilter === 'LIVE') return allMatches.filter(m => m.type === 'LIVE')
    if (activeFilter === 'UPCOMING') return allMatches.filter(m => m.type === 'UPCOMING')
    if (activeFilter === 'COMPLETED') return allMatches.filter(m => m.type === 'COMPLETED')
    return allMatches
  })()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '22px', letterSpacing: '0.12em', color: C.textPrimary, textShadow: `0 0 20px ${C.neonBlue}40` }}>
            MATCH PREDICTIONS
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
            AI-POWERED OUTCOME FORECASTING · CHAMPIONS 2025
          </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Filter size={14} style={{ color: C.textMuted }} />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: '6px 14px',
                background: activeFilter === f ? `${C.neonBlue}20` : C.bgCard,
                border: `1px solid ${activeFilter === f ? C.neonBlue + '50' : C.borderDefault}`,
                borderRadius: '2px',
                cursor: 'pointer',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                fontSize: '11px',
                letterSpacing: '0.12em',
                color: activeFilter === f ? C.neonBlue : C.textMuted,
                transition: 'all 0.2s ease',
                clipPath: activeFilter === f ? 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)' : undefined,
                boxShadow: activeFilter === f ? `0 0 10px ${C.neonBlue}25` : undefined,
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Model info banner */}
      <div
        style={{
          padding: '12px 16px',
          background: `${C.neonBlue}08`,
          border: `1px solid ${C.neonBlue}20`,
          borderRadius: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>MODEL STATUS</span>
        <div style={{ width: '1px', height: '16px', background: C.borderDefault }} />
        {[
          { label: 'ALGORITHM', value: 'ZYPHOR v3.2' },
          { label: 'TRAINING DATA', value: '24,847 matches' },
          { label: 'ACCURACY', value: '91.2%' },
          { label: 'LAST UPDATED', value: '2h 14m ago' },
          { label: 'STATUS', value: 'ACTIVE', color: '#39FF14' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.1em', color: C.textMuted }}>{label}:</span>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '0.08em', color: color || C.textSecondary, textShadow: color ? `0 0 6px ${color}80` : undefined }}>{value}</span>
          </div>
        ))}
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
          ⚠ Failed to fetch predictions: {error}
        </div>
      )}

      {/* Match cards grid */}
      {loading && filtered.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px',
          background: C.bgCard,
          border: `1px solid ${C.borderDefault}`,
          borderRadius: '2px',
        }}>
          <div style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>
            <Filter size={32} style={{ color: C.neonBlue }} />
          </div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px', color: C.textMuted, letterSpacing: '0.1em', marginTop: '16px' }}>
            LOADING PREDICTIONS...
          </div>
        </div>
      ) : filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '16px' }}>
          {filtered.map((match) => {
            const { probA, probB } = calcProbability(match.teamA, match.teamB)
            const mapPool = ('mapStats' in match.teamA ? match.teamA.mapStats : []) as any[]
            return (
              <MatchPredictionCard
                key={match.id}
                teamA={match.teamA}
                teamB={match.teamB}
                probA={probA}
                probB={probB}
                round={match.round}
                mapPool={mapPool}
                isLive={match.isLive}
              />
            )
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '60px',
            background: C.bgCard,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: '2px',
          }}
        >
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px', color: C.textMuted, letterSpacing: '0.1em' }}>
            NO MATCHES FOUND
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '13px', color: C.textMuted, marginTop: '8px' }}>
            Try adjusting your filters
          </div>
        </div>
      )}
    </div>
  )
}