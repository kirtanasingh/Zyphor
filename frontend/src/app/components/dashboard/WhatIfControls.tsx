import React from 'react'
import { C } from '../../theme'
import { NeonCard } from '../ui/NeonCard'
import { type Team } from '../../data/realData'
import { Flame, Wind, Snowflake, Map as MapIcon, Users } from 'lucide-react'

interface WhatIfControlsProps {
  teamA: Team | null
  teamB: Team | null
  formA: 'HOT' | 'NEUTRAL' | 'COLD'
  formB: 'HOT' | 'NEUTRAL' | 'COLD'
  selectedMap: string
  playerPerformance: number
  onFormAChange: (form: 'HOT' | 'NEUTRAL' | 'COLD') => void
  onFormBChange: (form: 'HOT' | 'NEUTRAL' | 'COLD') => void
  onMapChange: (map: string) => void
  onPlayerPerformanceChange: (value: number) => void
}

const MAPS = ['Bind', 'Haven', 'Ascent', 'Split', 'Fracture', 'Lotus', 'Sunset']

function FormToggle({ 
  label, 
  value, 
  onChange, 
  color 
}: { 
  label: string
  value: 'HOT' | 'NEUTRAL' | 'COLD'
  onChange: (v: 'HOT' | 'NEUTRAL' | 'COLD') => void
  color: string
}) {
  const options: Array<{ val: 'HOT' | 'NEUTRAL' | 'COLD', icon: any, col: string }> = [
    { val: 'HOT', icon: Flame, col: '#FF6B35' },
    { val: 'NEUTRAL', icon: Wind, col: C.neonBlue },
    { val: 'COLD', icon: Snowflake, col: '#4A90E2' },
  ]

  return (
    <div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, marginBottom: '8px' }}>
        {label} FORM
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {options.map(opt => {
          const Icon = opt.icon
          const isActive = value === opt.val
          return (
            <button
              key={opt.val}
              onClick={() => onChange(opt.val)}
              style={{
                flex: 1,
                padding: '10px',
                background: isActive ? `${opt.col}20` : `${C.bgCardLighter}60`,
                border: `1px solid ${isActive ? opt.col : C.borderDefault}`,
                borderRadius: '2px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Icon size={14} style={{ color: isActive ? opt.col : C.textMuted, filter: isActive ? `drop-shadow(0 0 6px ${opt.col})` : 'none' }} />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '10px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.1em',
                color: isActive ? opt.col : C.textMuted,
              }}>
                {opt.val}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function WhatIfControls({
  teamA,
  teamB,
  formA,
  formB,
  selectedMap,
  playerPerformance,
  onFormAChange,
  onFormBChange,
  onMapChange,
  onPlayerPerformanceChange,
}: WhatIfControlsProps) {
  return (
    <NeonCard clipTopRight accent={C.toxicGreen}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: C.toxicGreen, textShadow: `0 0 15px ${C.toxicGreen}60` }}>
          WHAT-IF CONTROLS
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          ADJUST VARIABLES TO RECALCULATE PREDICTIONS
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        {teamA && <FormToggle label={teamA.name} value={formA} onChange={onFormAChange} color={teamA.color} />}
        {teamB && <FormToggle label={teamB.name} value={formB} onChange={onFormBChange} color={teamB.color} />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Map Selection */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <MapIcon size={12} style={{ color: C.textMuted }} />
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>
              MAP SELECTION
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <select
              value={selectedMap}
              onChange={(e) => onMapChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: `${C.bgCardLighter}80`,
                border: `1px solid ${C.neonBlue}40`,
                borderRadius: '2px',
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: C.neonBlue,
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              {MAPS.map(map => (
                <option key={map} value={map} style={{ background: C.bgCard, color: C.textPrimary }}>
                  {map}
                </option>
              ))}
            </select>
            <div style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              width: 0,
              height: 0,
              borderLeft: '4px solid transparent',
              borderRight: '4px solid transparent',
              borderTop: `4px solid ${C.neonBlue}`,
            }} />
          </div>
        </div>

        {/* Player Performance */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Users size={12} style={{ color: C.textMuted }} />
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted }}>
              PLAYER PERFORMANCE
            </div>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={playerPerformance}
              onChange={(e) => onPlayerPerformanceChange(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: '4px',
                background: `linear-gradient(to right, ${C.neonBlue} 0%, ${C.neonBlue} ${playerPerformance}%, ${C.bgCardLighter} ${playerPerformance}%, ${C.bgCardLighter} 100%)`,
                borderRadius: '2px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', color: C.textMuted }}>
                POOR
              </span>
              <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', fontWeight: 700, color: C.neonBlue }}>
                {playerPerformance}%
              </span>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', color: C.textMuted }}>
                ELITE
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          background: ${C.neonBlue};
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px ${C.neonBlue}80;
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: ${C.neonBlue};
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px ${C.neonBlue}80;
          border: none;
        }
      `}</style>
    </NeonCard>
  )
}
