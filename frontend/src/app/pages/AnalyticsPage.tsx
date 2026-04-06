import React from 'react'
import { C } from '../theme'
import { ProbabilityGraph } from '../components/dashboard/ProbabilityGraph'
import { NeonCard } from '../components/ui/NeonCard'

const MODEL_STATS = [
  { label: 'PRECISION', value: '92.1%', sub: 'True positive rate', color: '#39FF14' },
  { label: 'RECALL', value: '88.7%', sub: 'Sensitivity measure', color: C.neonBlue },
  { label: 'F1 SCORE', value: '0.903', sub: 'Harmonic mean', color: C.hotPurple },
  { label: 'LOG LOSS', value: '0.241', sub: 'Confidence penalty', color: '#FFD700' },
]

export function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '22px', letterSpacing: '0.12em', color: C.textPrimary, textShadow: `0 0 20px ${C.neonBlue}40` }}>
          PROBABILITY ANALYTICS
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          WIN PROBABILITY TRENDS · MODEL PERFORMANCE METRICS
        </div>
      </div>

      {/* Model performance cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {MODEL_STATS.map(({ label, value, sub, color }) => (
          <NeonCard key={label} clipTopRight accent={color}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '8px' }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '24px', color, textShadow: `0 0 16px ${color}80`, lineHeight: 1, marginBottom: '4px' }}>
              {value}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', color: C.textSecondary }}>
              {sub}
            </div>
          </NeonCard>
        ))}
      </div>

      {/* Main probability graph */}
      <ProbabilityGraph />

      {/* Calibration info */}
      <NeonCard noPadding>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.borderDefault}` }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '11px', letterSpacing: '0.2em', color: C.textMuted }}>
            MODEL CALIBRATION · CONFIDENCE BINS
          </span>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
          {[
            { range: '50–60%', actual: 54, predicted: 55, n: 12 },
            { range: '60–70%', actual: 64, predicted: 65, n: 28 },
            { range: '70–80%', actual: 73, predicted: 75, n: 41 },
            { range: '80–90%', actual: 84, predicted: 85, n: 19 },
            { range: '90–100%', actual: 92, predicted: 94, n: 8 },
          ].map(({ range, actual, predicted, n }) => (
            <div
              key={range}
              style={{
                padding: '12px',
                background: `${C.bgCardLighter}80`,
                border: `1px solid ${C.borderDefault}`,
                borderRadius: '2px',
              }}
            >
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.1em', color: C.textMuted, marginBottom: '8px' }}>
                {range}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', color: C.textMuted, marginBottom: '3px' }}>ACTUAL</div>
                  <div style={{ height: '3px', background: '#060610', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${actual}%`, height: '100%', background: '#39FF14', boxShadow: '0 0 4px #39FF14' }} />
                  </div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: '#39FF14', marginTop: '3px' }}>{actual}%</div>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', color: C.textMuted, marginBottom: '3px' }}>PREDICTED</div>
                  <div style={{ height: '3px', background: '#060610', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${predicted}%`, height: '100%', background: C.neonBlue, boxShadow: `0 0 4px ${C.neonBlue}` }} />
                  </div>
                  <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: C.neonBlue, marginTop: '3px' }}>{predicted}%</div>
                </div>
              </div>
              <div style={{ marginTop: '8px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', color: C.textMuted }}>
                n={n} matches
              </div>
            </div>
          ))}
        </div>
      </NeonCard>
    </div>
  )
}
