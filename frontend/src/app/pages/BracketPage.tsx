import React, { useState } from 'react'
import { C } from '../theme'
import { TournamentBracket } from '../components/dashboard/TournamentBracket'
import { useValorantData } from '../data/useValorantData'
import { Zap } from 'lucide-react'

export function BracketPage() {
  const [activeTab, setActiveTab] = useState(0)
  const { teams, loading, error } = useValorantData('na')

  // Generate bracket structure from real teams
  const generateBracket = () => {
    if (teams.length === 0) return { rounds: [], tournament: '', format: '' }
    
    const top8 = teams.slice(0, 8)
    return {
      tournament: 'Valorant Champions 2025',
      format: 'Single Elimination',
      rounds: [
        {
          id: 'round-1',
          name: 'SEMI-FINALS',
          matches: [
            { id: 'match-1', teamA: top8[0] || null, teamB: top8[7] || null, probA: 50, probB: 50, scoreA: 0, scoreB: 0, winner: null, completed: false },
            { id: 'match-2', teamA: top8[3] || null, teamB: top8[4] || null, probA: 50, probB: 50, scoreA: 0, scoreB: 0, winner: null, completed: false },
          ],
        },
        {
          id: 'round-2',
          name: 'FINALS',
          matches: [
            { id: 'match-3', teamA: null, teamB: null, probA: 50, probB: 50, scoreA: 0, scoreB: 0, winner: null, completed: false },
          ],
        },
      ],
    }
  }

  const bracketData = generateBracket()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page header */}
      <div>
        <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '22px', letterSpacing: '0.12em', color: C.textPrimary, textShadow: `0 0 20px ${C.neonBlue}40` }}>
          TOURNAMENT BRACKET
        </div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.15em', color: C.textMuted, marginTop: '2px' }}>
          VALORANT CHAMPIONS 2025 · LIVE RANKINGS
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
          ⚠ Failed to load bracket data: {error}
        </div>
      )}

      {/* Phase tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: `1px solid ${C.borderDefault}` }}>
        {['PLAYOFFS', 'GROUP STAGE', 'PLAY-INS'].map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '10px 20px',
              background: activeTab === idx ? `${C.neonBlue}12` : 'transparent',
              border: 'none',
              borderBottom: activeTab === idx ? `2px solid ${C.neonBlue}` : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.12em',
              color: activeTab === idx ? C.neonBlue : C.textMuted,
              transition: 'all 0.2s ease',
              marginBottom: '-1px',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bracket container */}
      <div
        style={{
          background: C.bgCard,
          border: `1px solid ${C.borderDefault}`,
          borderRadius: '2px',
          padding: '24px',
          overflowX: 'auto',
          boxShadow: `0 0 30px ${C.neonBlue}06`,
          minHeight: '300px',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textMuted }}>
            <div style={{ animation: 'spin 2s linear infinite', display: 'inline-block' }}>
              <Zap size={32} style={{ color: C.neonBlue }} />
            </div>
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px', marginTop: '16px' }}>
              LOADING BRACKET...
            </div>
          </div>
        ) : activeTab === 0 && bracketData.rounds.length > 0 ? (
          <TournamentBracket
            rounds={bracketData.rounds}
            tournament={bracketData.tournament}
            format={bracketData.format}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: C.textMuted }}>
            <Zap size={32} style={{ color: C.textMuted, marginBottom: '16px' }} />
            <div style={{ fontFamily: "'Orbitron', sans-serif", fontSize: '14px' }}>
              {activeTab === 0 ? 'BRACKET DATA NOT AVAILABLE' : 'DATA COMING SOON'}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', marginTop: '8px' }}>
              {activeTab === 0 ? 'Using live team rankings instead' : 'This section will be available soon'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
