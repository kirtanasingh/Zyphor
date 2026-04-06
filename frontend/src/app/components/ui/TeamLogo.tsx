import React from 'react'

interface TeamLogoProps {
  name: string
  color: string
  size?: number
  shape?: 'hex' | 'diamond' | 'square'
}

export function TeamLogo({ name, color, size = 60, shape = 'hex' }: TeamLogoProps) {
  const initials = name.slice(0, 2).toUpperCase()
  const fontSize = size * 0.28

  const clipPaths = {
    hex: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
    diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    square: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}18 0%, ${color}30 100%)`,
        clipPath: clipPaths[shape],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        boxShadow: `0 0 ${size * 0.25}px ${color}50`,
      }}
    >
      {/* Inner ring */}
      <div
        style={{
          position: 'absolute',
          inset: '2px',
          clipPath: clipPaths[shape],
          border: `1px solid ${color}60`,
          background: `linear-gradient(135deg, ${color}08, ${color}1A)`,
        }}
      />
      <span
        style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 800,
          fontSize: fontSize,
          color: color,
          letterSpacing: '0.05em',
          textShadow: `0 0 12px ${color}CC`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {initials}
      </span>
    </div>
  )
}
