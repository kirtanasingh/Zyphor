import React from 'react'
import { NavLink } from 'react-router'
import {
  LayoutDashboard,
  Crosshair,
  Trophy,
  Users,
  LineChart,
  Zap,
  Shield,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { C } from '../../theme'

const NAV_ITEMS = [
  { path: '/', label: 'DASHBOARD', icon: LayoutDashboard, exact: true },
  { path: '/predictions', label: 'PREDICTIONS', icon: Crosshair },
  { path: '/bracket', label: 'BRACKET', icon: Trophy },
  { path: '/teams', label: 'TEAMS', icon: Users },
  { path: '/analytics', label: 'ANALYTICS', icon: LineChart },
  { path: '/live', label: 'LIVE MATCHES', icon: Zap, accent: '#39FF14' },
]

function NavItem({ path, label, icon: Icon, accent }: { path: string; label: string; icon: any; accent?: string; exact?: boolean }) {
  return (
    <NavLink
      to={path}
      end={path === '/'}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '2px',
        textDecoration: 'none',
        position: 'relative',
        background: isActive ? `${accent || C.neonBlue}14` : 'transparent',
        border: `1px solid ${isActive ? (accent || C.neonBlue) + '40' : 'transparent'}`,
        transition: 'all 0.2s ease',
        clipPath: isActive ? 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' : undefined,
      })}
      className="group"
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: '20%',
                bottom: '20%',
                width: '2px',
                background: accent || C.neonBlue,
                boxShadow: `0 0 8px ${accent || C.neonBlue}`,
              }}
            />
          )}
          <Icon
            size={16}
            style={{
              color: isActive ? (accent || C.neonBlue) : C.textMuted,
              filter: isActive ? `drop-shadow(0 0 6px ${accent || C.neonBlue})` : undefined,
              transition: 'color 0.2s',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '0.1em',
              color: isActive ? (accent || C.neonBlue) : C.textSecondary,
              textShadow: isActive ? `0 0 10px ${accent || C.neonBlue}80` : undefined,
              transition: 'color 0.2s',
            }}
          >
            {label}
          </span>
          {label === 'LIVE MATCHES' && (
            <div
              style={{
                marginLeft: 'auto',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#39FF14',
                boxShadow: '0 0 6px #39FF14, 0 0 12px #39FF14',
                animation: 'pulse 1.5s infinite',
              }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        height: '100vh',
        background: C.bgCard,
        borderRight: `1px solid ${C.borderDefault}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px',
          borderBottom: `1px solid ${C.borderDefault}`,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            background: `linear-gradient(135deg, ${C.neonBlue}30, ${C.neonBlue}60)`,
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 15px ${C.neonBlue}60`,
            flexShrink: 0,
          }}
        >
          <Shield size={14} style={{ color: C.neonBlue }} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: '14px',
              color: C.neonBlue,
              letterSpacing: '0.15em',
              textShadow: `0 0 12px ${C.neonBlue}80`,
            }}
          >
            ZYPHOR
          </div>
          <div
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: C.textMuted,
              marginTop: '-2px',
            }}
          >
            ESPORTS ANALYTICS
          </div>
        </div>
      </div>

      {/* Tournament indicator */}
      <div
        style={{
          margin: '12px 16px',
          padding: '8px 10px',
          background: `${C.neonBlue}08`,
          border: `1px solid ${C.neonBlue}20`,
          borderRadius: '2px',
        }}
      >
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.15em', color: C.textMuted }}>
          ACTIVE TOURNAMENT
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '12px', color: C.textPrimary, marginTop: '2px' }}>
          Champions 2025
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 6px #39FF14' }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: '#39FF14', letterSpacing: '0.08em' }}>3 MATCHES LIVE</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: C.textMuted, padding: '4px 14px 8px', marginTop: '4px' }}>
          NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: C.borderDefault, margin: '0 16px' }} />

      {/* Settings */}
      <div style={{ padding: '12px 12px 20px' }}>
        <NavLink
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          <Settings size={16} style={{ color: C.textMuted }} />
          <span style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 600,
            fontSize: '13px',
            letterSpacing: '0.1em',
            color: C.textMuted,
          }}>
            SETTINGS
          </span>
        </NavLink>

        {/* User */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            marginTop: '4px',
            background: `${C.neonBlue}06`,
            border: `1px solid ${C.borderDefault}`,
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '2px',
              background: `linear-gradient(135deg, ${C.hotPurple}30, ${C.hotPurple}50)`,
              border: `1px solid ${C.hotPurple}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '11px', fontWeight: 700, color: C.hotPurple }}>TZ</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, fontSize: '12px', color: C.textPrimary }}>
              TEAM ZYPHOR
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
              ANALYST PRO
            </div>
          </div>
          <ChevronRight size={12} style={{ color: C.textMuted, marginLeft: 'auto' }} />
        </div>
      </div>
    </aside>
  )
}