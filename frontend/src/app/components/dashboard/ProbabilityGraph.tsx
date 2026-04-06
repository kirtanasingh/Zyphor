import React, { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Line,
  LineChart,
} from 'recharts'
import { TrendingUp, Award } from 'lucide-react'
import { C } from '../../theme'
import { useTeams } from '../../data/useValorantData'
import { NeonCard } from '../ui/NeonCard'

const SECONDARY_TEAM_DATA = [
  { tournament: 'VCT 2024 S1', prob: 55, placement: 4 },
  { tournament: 'Masters Tokyo', prob: 61, placement: 3 },
  { tournament: 'VCT 2024 S2', prob: 58, placement: 2 },
  { tournament: 'Champions 2024', prob: 64, placement: 1 },
  { tournament: 'VCT 2025 S1', prob: 60, placement: 2 },
  { tournament: 'Masters Seoul', prob: 67, placement: 2 },
  { tournament: 'VCT 2025 S2', prob: 63, placement: 3 },
  { tournament: 'Champions 2025', prob: 71, placement: null },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: C.bgCard,
          border: `1px solid ${C.neonBlue}40`,
          padding: '12px',
          borderRadius: '2px',
          boxShadow: `0 0 20px ${C.neonBlue}30`,
          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)',
        }}
      >
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', letterSpacing: '0.1em', color: C.textMuted, marginBottom: '8px' }}>
          {label}
        </div>
        {payload.map((entry: any, idx: number) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color, boxShadow: `0 0 6px ${entry.color}` }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '11px', letterSpacing: '0.08em', color: C.textSecondary }}>
              {entry.name}
            </span>
            <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color: entry.color, textShadow: `0 0 8px ${entry.color}AA`, marginLeft: 'auto' }}>
              {entry.value}%
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

const CustomDot = ({ cx, cy, payload, color }: any) => {
  if (payload.placement === 1) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill={color} />
        <circle cx={cx} cy={cy} r={10} fill="none" stroke={color} strokeWidth={1} opacity={0.4} />
        <text x={cx} y={cy - 16} textAnchor="middle" fill="#39FF14" fontSize={10} fontFamily="'Barlow Condensed', sans-serif" fontWeight={700}>
          🏆
        </text>
      </g>
    )
  }
  if (!payload.placement) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={5} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        <circle cx={cx} cy={cy} r={9} fill="none" stroke={color} strokeWidth={1} opacity={0.6} className="animate-ping" />
      </g>
    )
  }
  return <circle cx={cx} cy={cy} r={4} fill={color} opacity={0.8} />
}

export function ProbabilityGraph() {
  const { teams: liveTeams } = useTeams('na')
  const teams = liveTeams.length ? liveTeams : []
  const [selectedTeam1, setSelectedTeam1] = useState(teams[0])
  const [selectedTeam2, setSelectedTeam2] = useState(teams[1])
  const [showComparison, setShowComparison] = useState(true)

  React.useEffect(() => {
    if (teams.length >= 2 && (!selectedTeam1 || !selectedTeam2)) {
      setSelectedTeam1(teams[0])
      setSelectedTeam2(teams[1])
    }
  }, [teams, selectedTeam1, selectedTeam2])

  if (!selectedTeam1 || !selectedTeam2) {
    return (
      <NeonCard>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', color: C.textMuted }}>
          Loading team trend data...
        </div>
      </NeonCard>
    )
  }

  const team1Data = selectedTeam1.probHistory
  const team2Data = SECONDARY_TEAM_DATA

  // Merge data by tournament
  const mergedData = team1Data.map((d, i) => ({
    tournament: d.tournament.replace('VALORANT ', '').replace('VCT ', ''),
    [selectedTeam1.name]: d.prob,
    [selectedTeam2.name]: team2Data[i]?.prob || null,
    placement1: d.placement,
    placement2: team2Data[i]?.placement,
  }))

  const maxProb = Math.max(...team1Data.map(d => d.prob), ...team2Data.map(d => d.prob))
  const minProb = Math.min(...team1Data.map(d => d.prob), ...team2Data.map(d => d.prob))
  const trend = team1Data.length > 1 ? team1Data[team1Data.length - 1].prob - team1Data[0].prob : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, fontSize: '16px', letterSpacing: '0.1em', color: C.textPrimary }}>
            WIN PROBABILITY TREND
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '12px', letterSpacing: '0.1em', color: C.textMuted, marginTop: '2px' }}>
            HISTORICAL PREDICTION ACCURACY ACROSS TOURNAMENTS
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Team 1 selector */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {teams.slice(0, 4).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeam1(t)}
                style={{
                  padding: '4px 10px',
                  background: selectedTeam1.id === t.id ? `${t.color}20` : C.bgCard,
                  border: `1px solid ${selectedTeam1.id === t.id ? t.color + '60' : C.borderDefault}`,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  color: selectedTeam1.id === t.id ? t.color : C.textMuted,
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTeam1.id === t.id ? `0 0 8px ${t.color}30` : undefined,
                }}
              >
                {t.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowComparison(!showComparison)}
            style={{
              padding: '4px 10px',
              background: showComparison ? `${selectedTeam2.color}15` : C.bgCard,
              border: `1px solid ${showComparison ? selectedTeam2.color + '50' : C.borderDefault}`,
              borderRadius: '2px',
              cursor: 'pointer',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: showComparison ? selectedTeam2.color : C.textMuted,
              transition: 'all 0.2s ease',
            }}
          >
            vs {selectedTeam2.name}
          </button>
        </div>
      </div>

      {/* Main chart */}
      <NeonCard noPadding accent={selectedTeam1.color}>
        {/* Chart header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: `1px solid ${C.borderDefault}`,
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          {/* Team 1 stat */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '3px', height: '30px', background: selectedTeam1.color, boxShadow: `0 0 8px ${selectedTeam1.color}` }} />
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', color: selectedTeam1.color }}>
                {selectedTeam1.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '20px', color: selectedTeam1.color, textShadow: `0 0 12px ${selectedTeam1.color}AA` }}>
                  {team1Data[team1Data.length - 1]?.prob}%
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <TrendingUp size={12} style={{ color: trend >= 0 ? '#39FF14' : '#FF4444' }} />
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: trend >= 0 ? '#39FF14' : '#FF4444' }}>
                    {trend >= 0 ? '+' : ''}{trend}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showComparison && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '3px', height: '30px', background: selectedTeam2.color, boxShadow: `0 0 8px ${selectedTeam2.color}` }} />
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em', color: selectedTeam2.color }}>
                  {selectedTeam2.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800, fontSize: '20px', color: selectedTeam2.color, textShadow: `0 0 12px ${selectedTeam2.color}AA` }}>
                    {SECONDARY_TEAM_DATA[SECONDARY_TEAM_DATA.length - 1].prob}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px' }}>
            {[
              { label: 'PEAK', value: `${maxProb}%`, color: '#39FF14' },
              { label: 'LOW', value: `${minProb}%`, color: '#FF4444' },
              { label: 'RANGE', value: `${maxProb - minProb}%`, color: C.neonBlue },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '9px', letterSpacing: '0.18em', color: C.textMuted }}>
                  {label}
                </div>
                <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '13px', color, textShadow: `0 0 8px ${color}80`, marginTop: '2px' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div style={{ padding: '20px 12px 12px', height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mergedData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`grad1-${selectedTeam1.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedTeam1.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={selectedTeam1.color} stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id={`grad2-${selectedTeam2.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={selectedTeam2.color} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={selectedTeam2.color} stopOpacity={0.01} />
                </linearGradient>
                <filter id="glowFilter">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="1 4"
                stroke={`${C.neonBlue}08`}
                vertical={false}
              />

              <XAxis
                dataKey="tournament"
                tick={{ fill: C.textMuted, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 1 }}
                axisLine={{ stroke: C.borderDefault }}
                tickLine={false}
                dy={8}
              />

              <YAxis
                domain={[40, 100]}
                tick={{ fill: C.textMuted, fontFamily: "'Share Tech Mono', monospace", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={40}
              />

              <Tooltip content={<CustomTooltip />} />

              <ReferenceLine
                y={50}
                stroke={C.textMuted}
                strokeDasharray="4 4"
                strokeOpacity={0.3}
                label={{ value: '50% EVEN', fill: C.textMuted, fontSize: 9, fontFamily: "'Barlow Condensed', sans-serif" }}
              />

              {showComparison && (
                <Area
                  type="monotone"
                  dataKey={selectedTeam2.name}
                  stroke={selectedTeam2.color}
                  strokeWidth={1.5}
                  strokeDasharray="4 2"
                  fill={`url(#grad2-${selectedTeam2.id})`}
                  dot={false}
                  activeDot={{ r: 5, fill: selectedTeam2.color }}
                />
              )}

              <Area
                type="monotone"
                dataKey={selectedTeam1.name}
                stroke={selectedTeam1.color}
                strokeWidth={2.5}
                fill={`url(#grad1-${selectedTeam1.id})`}
                dot={(props: any) => <CustomDot {...props} color={selectedTeam1.color} />}
                activeDot={{ r: 6, fill: selectedTeam1.color, stroke: '#fff', strokeWidth: 1 }}
                filter="url(#glowFilter)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Footer with tournament legend */}
        <div
          style={{
            padding: '10px 20px 14px',
            borderTop: `1px solid ${C.borderDefault}`,
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={10} style={{ color: '#39FF14' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
              🏆 = Tournament win
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '16px', height: '2px', background: selectedTeam1.color, boxShadow: `0 0 4px ${selectedTeam1.color}` }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
              {selectedTeam1.name} predicted win %
            </span>
          </div>
          {showComparison && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '16px',
                height: '0',
                borderTop: `2px dashed ${selectedTeam2.color}`,
              }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
                {selectedTeam2.name} predicted win %
              </span>
            </div>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#39FF14', boxShadow: '0 0 6px #39FF14' }} />
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '10px', color: C.textMuted }}>
                LIVE — CURRENT TOURNAMENT
              </span>
            </div>
          </div>
        </div>
      </NeonCard>

      {/* Secondary mini charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {teams.slice(0, 4).map((team) => {
          const lastProb = team.probHistory[team.probHistory.length - 1]?.prob || 0
          const firstProb = team.probHistory[0]?.prob || 0
          const teamTrend = lastProb - firstProb

          return (
            <NeonCard key={team.id} accent={team.color} noPadding>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', color: team.color }}>
                    {team.name}
                  </span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '11px', color: teamTrend >= 0 ? '#39FF14' : '#FF4444' }}>
                    {teamTrend >= 0 ? '+' : ''}{teamTrend}%
                  </span>
                </div>
                <div style={{ height: '60px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={team.probHistory} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <filter id={`glow-mini-${team.id}`}>
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="prob"
                        stroke={team.color}
                        strokeWidth={2}
                        dot={false}
                        filter={`url(#glow-mini-${team.id})`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '10px', color: C.textMuted }}>{firstProb}%</span>
                  <span style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '12px', color: team.color, textShadow: `0 0 8px ${team.color}AA` }}>
                    {lastProb}%
                  </span>
                </div>
              </div>
            </NeonCard>
          )
        })}
      </div>
    </div>
  )
}
