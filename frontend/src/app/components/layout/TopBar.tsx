import React, { useState, useEffect } from 'react'
import { Bell, RefreshCw, ChevronDown, Radio, Activity } from 'lucide-react'
import { C } from '../../theme'

export function TopBar() {
  const [time, setTime] = useState(new Date())
  const [tick, setTick] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
      setTick(t => !t)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const timeStr = time.toUTCString().split(' ').slice(4, 5)[0] || '18:00:00'

  return (
    <header
      style={{
        height: '54px',
        background: C.bgCard,
        borderBottom: `1px solid ${C.borderDefault}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Tournament name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 12px',
            background: `${C.neonBlue}10`,
            border: `1px solid ${C.neonBlue}30`,
            clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
          }}
        >
          <Radio size={12} style={{ color: C.neonBlue }} />
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.15em',
              color: C.neonBlue,
              textShadow: `0 0 10px ${C.neonBlue}80`,
            }}
          >
            VALORANT CHAMPIONS 2025
          </span>
        </div>

        {/* Round indicator */}
        <div
          style={{
            padding: '3px 10px',
            background: `${C.hotPurple}12`,
            border: `1px solid ${C.hotPurple}30`,
            borderRadius: '2px',
          }}
        >
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.1em',
              color: C.hotPurple,
            }}
          >
            SEMI-FINALS
          </span>
        </div>
      </div>

      {/* Live matches ticker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              background: '#39FF1410',
              border: '1px solid #39FF1430',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#39FF14',
                boxShadow: tick ? '0 0 8px #39FF14, 0 0 16px #39FF14' : '0 0 2px #39FF14',
                transition: 'box-shadow 0.5s ease',
              }}
            />
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.15em',
                color: '#39FF14',
              }}
            >
              LIVE
            </span>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '11px',
                letterSpacing: '0.05em',
                color: '#39FF14AA',
              }}
            >
              3 MATCHES
            </span>
          </div>

          {/* Match score ticker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={12} style={{ color: C.textMuted }} />
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.05em',
                color: C.textSecondary,
              }}
            >
              PHANTOM
            </span>
            <span
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                color: C.textPrimary,
                background: C.bgCardLighter,
                padding: '2px 6px',
                border: `1px solid ${C.borderDefault}`,
              }}
            >
              1 – 0
            </span>
            <span
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '12px',
                letterSpacing: '0.05em',
                color: C.textSecondary,
              }}
            >
              SHADOW
            </span>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: C.borderDefault }} />

        {/* UTC Time */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '12px',
              color: C.textMuted,
              letterSpacing: '0.05em',
            }}
          >
            UTC
          </span>
          <span
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '13px',
              color: C.textSecondary,
              letterSpacing: '0.05em',
            }}
          >
            {timeStr}
          </span>
        </div>

        <div style={{ width: '1px', height: '24px', background: C.borderDefault }} />

        {/* Model accuracy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.12em', color: C.textMuted }}>
            MODEL ACC
          </span>
          <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '12px', fontWeight: 700, color: '#39FF14', textShadow: '0 0 8px #39FF14AA' }}>
            91.2%
          </span>
        </div>

        <div style={{ width: '1px', height: '24px', background: C.borderDefault }} />

        {/* Notification */}
        <button
          style={{
            width: '32px',
            height: '32px',
            background: `${C.neonBlue}08`,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Bell size={14} style={{ color: C.textSecondary }} />
          <div
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '5px',
              height: '5px',
              borderRadius: '50%',
              background: C.neonBlue,
              boxShadow: `0 0 6px ${C.neonBlue}`,
            }}
          />
        </button>

        <button
          style={{
            width: '32px',
            height: '32px',
            background: `${C.neonBlue}08`,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={13} style={{ color: C.textSecondary }} />
        </button>
      </div>
    </header>
  )
}
