import React, { useState } from 'react'
import { C, clipCorner } from '../../theme'

interface NeonCardProps {
  children: React.ReactNode
  className?: string
  clipTopRight?: boolean
  clipBothCorners?: boolean
  accent?: string
  noPadding?: boolean
  style?: React.CSSProperties
  onClick?: () => void
}

export function NeonCard({
  children,
  className = '',
  clipTopRight = false,
  clipBothCorners = false,
  accent = C.neonBlue,
  noPadding = false,
  style,
  onClick,
}: NeonCardProps) {
  const [hovered, setHovered] = useState(false)

  const clipPath = clipTopRight
    ? 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)'
    : clipBothCorners
    ? 'polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 0)'
    : undefined

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.bgCard,
        border: `1px solid ${hovered ? `${accent}50` : `${accent}18`}`,
        clipPath,
        padding: noPadding ? undefined : '20px',
        position: 'relative',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease',
        boxShadow: hovered
          ? `0 0 25px ${accent}25, 0 0 50px ${accent}08, inset 0 0 30px ${accent}05`
          : `0 0 10px ${accent}08, inset 0 0 20px ${accent}03`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* Corner accent */}
      {clipTopRight && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 0,
            height: 0,
            borderStyle: 'solid',
            borderWidth: '0 14px 14px 0',
            borderColor: `transparent ${hovered ? `${accent}80` : `${accent}30`} transparent transparent`,
            transition: 'border-color 0.2s ease',
          }}
        />
      )}
      {children}
    </div>
  )
}
