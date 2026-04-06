import React from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { C } from '../../theme'

export function Layout() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        fontFamily: "'Inter', sans-serif",
        // Hex grid background pattern
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(0, 212, 255, 0.04) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(191, 95, 255, 0.04) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104' viewBox='0 0 60 104'%3E%3Cpath d='M30 4 L56 19 L56 49 L30 64 L4 49 L4 19 Z' fill='none' stroke='%2300D4FF' stroke-opacity='0.03' stroke-width='1'/%3E%3Cpath d='M30 64 L56 79 L56 109 L30 124 L4 109 L4 79 Z' fill='none' stroke='%2300D4FF' stroke-opacity='0.03' stroke-width='1'/%3E%3C/svg%3E")
        `,
        backgroundSize: 'cover, cover, 60px 104px',
      }}
    >
      {/* Scanlines overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.04) 0px,
            rgba(0, 0, 0, 0.04) 1px,
            transparent 1px,
            transparent 3px
          )`,
          pointerEvents: 'none',
          zIndex: 200,
        }}
      />

      <Sidebar />

      <div style={{ marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar />
        <main
          style={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
