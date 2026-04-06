import { api } from '../../services/api'

export interface MapStat {
  map: string
  winRate: number
}

export interface ProbHistoryItem {
  tournament: string
  prob: number
  placement: number | null
}

export interface Team {
  id: string
  name: string
  fullName: string
  color: string
  region: string
  rank: number
  tier: 'S' | 'A' | 'B' | 'C'
  winRate: number
  avgKda: number
  mapWinRate: number
  form: 'HOT' | 'NEUTRAL' | 'COLD'
  streak: string
  h2h: { wins: number; losses: number }
  mapStats: MapStat[]
  probHistory: ProbHistoryItem[]
  logo: string
}

export interface UpcomingMatch {
  id: string
  teamA: Team
  teamB: Team
  event: string
  time: string
  round: string
  bestOf: number
}

export interface LiveMatch {
  id: string
  teamA: Team
  teamB: Team
  scoreA: number
  scoreB: number
  currentMap: string
  event: string
  round: string
  bestOf: number
}

export interface CompletedMatch {
  id: string
  teamA: Team
  teamB: Team
  scoreA: number
  scoreB: number
  event: string
  round: string
}

const TEAM_COLORS: Record<string, string> = {
  PHANTOM: '#00D4FF',
  NEXUS: '#FF6B35',
  VORTEX: '#9B59B6',
  APEX: '#39FF14',
  SHADOW: '#FF4444',
  CIPHER: '#FFD700',
  PULSE: '#FF69B4',
  CORE: '#00CED1',
}

const MAPS = ['Bind', 'Haven', 'Ascent', 'Split', 'Fracture', 'Lotus', 'Sunset', 'Abyss', 'Icebox']

function getTeamColor(teamName: string): string {
  return TEAM_COLORS[teamName] || '#00D4FF'
}

function syntheticMapStats(winRate: number): MapStat[] {
  return MAPS.map((map, i) => ({
    map,
    winRate: Math.max(20, Math.min(95, winRate + (i % 2 === 0 ? 8 : -8) + i * 2)),
  })).sort((a, b) => b.winRate - a.winRate)
}

function syntheticProbHistory(seed: number): ProbHistoryItem[] {
  const names = [
    'Season 1',
    'Season 2',
    'Season 3',
    'Season 4',
    'Season 5',
    'Championship 1',
    'Championship 2',
    'Championship 3',
  ]
  return names.map((tournament, idx) => ({
    tournament,
    prob: Math.max(45, Math.min(90, seed + idx * 2 - (idx % 3) * 3)),
    placement: idx < 7 ? ((idx % 4) + 1) : null,
  }))
}

export async function fetchTeams(): Promise<Team[]> {
  try {
    console.log('[realData.fetchTeams] Starting team fetch...')
    const response = await api.getTeams()
    console.log('[realData.fetchTeams] api.getTeams response:', response)
    const teamNames = (response as any).teams || []
    console.log('[realData.fetchTeams] Extracted teamNames:', teamNames, 'count:', teamNames.length)
    
    if (!teamNames.length) {
      console.error('[realData.fetchTeams] No teams found in response!')
      throw new Error('No teams found')
    }
    
    // Build Team objects from backend data
    const teams = await Promise.all(
      teamNames.map(async (name: string, idx: number) => {
        try {
          console.log(`[realData.fetchTeams] Loading stats for ${name}...`)
          const stats = await api.teamStats(name)
          console.log(`[realData.fetchTeams] Got stats for ${name}:`, stats)
          const totalMatches = ((stats as any).wins || 0) + ((stats as any).losses || 0) || 1
          const winRate = Math.round((((stats as any).wins || 0) / totalMatches) * 100)
          
          return {
            id: `team-${idx}`,
            name,
            fullName: name,
            color: getTeamColor(name),
            region: 'Global',
            rank: idx + 1,
            tier: idx < 2 ? 'S' : idx < 4 ? 'A' : idx < 6 ? 'B' : ('C' as const),
            winRate,
            avgKda: 1.2,
            mapWinRate: Math.max(40, winRate - 5),
            form: winRate > 65 ? ('HOT' as const) : winRate < 45 ? ('COLD' as const) : ('NEUTRAL' as const),
            streak: 'N/A',
            h2h: { wins: (stats as any).wins || 0, losses: (stats as any).losses || 0 },
            mapStats: syntheticMapStats(winRate),
            probHistory: syntheticProbHistory(winRate),
            logo: '',
          }
        } catch (e) {
          console.error(`[realData.fetchTeams] Error loading stats for ${name}:`, e)
          return {
            id: `team-${idx}`,
            name,
            fullName: name,
            color: getTeamColor(name),
            region: 'Global',
            rank: idx + 1,
            tier: 'B' as const,
            winRate: 50,
            avgKda: 1.0,
            mapWinRate: 50,
            form: 'NEUTRAL' as const,
            streak: 'N/A',
            h2h: { wins: 0, losses: 0 },
            mapStats: syntheticMapStats(50),
            probHistory: syntheticProbHistory(50),
            logo: '',
          }
        }
      })
    )
    console.log('[realData.fetchTeams] Returning teams:', teams.length, 'teams')
    return teams
  } catch (e) {
    console.error('[realData.fetchTeams] FAILED:', e)
    return []
  }
}

export async function fetchUpcomingMatches(teams: Team[]): Promise<UpcomingMatch[]> {
  if (teams.length === 0) return []
  return [
    {
      id: 'um-1',
      teamA: teams[0],
      teamB: teams[1],
      event: 'League Match',
      time: 'In 2 hours',
      round: 'Day 1',
      bestOf: 3,
    },
    {
      id: 'um-2',
      teamA: teams[2] || teams[0],
      teamB: teams[3] || teams[1],
      event: 'League Match',
      time: 'In 4 hours',
      round: 'Day 1',
      bestOf: 3,
    },
    {
      id: 'um-3',
      teamA: teams[4] || teams[0],
      teamB: teams[5] || teams[1],
      event: 'League Match',
      time: 'Tomorrow',
      round: 'Day 2',
      bestOf: 3,
    },
  ]
}

export async function fetchLiveMatches(teams: Team[]): Promise<LiveMatch[]> {
  if (teams.length === 0) return []
  const maps = ['Bind', 'Haven', 'Ascent', 'Split']
  return [
    {
      id: 'lm-1',
      teamA: teams[0],
      teamB: teams[1],
      scoreA: 1,
      scoreB: 0,
      currentMap: maps[0],
      event: 'League Match',
      round: 'Day 1',
      bestOf: 3,
    },
    {
      id: 'lm-2',
      teamA: teams[2] || teams[0],
      teamB: teams[3] || teams[1],
      scoreA: 0,
      scoreB: 1,
      currentMap: maps[1],
      event: 'League Match',
      round: 'Day 1',
      bestOf: 3,
    },
    {
      id: 'lm-3',
      teamA: teams[4] || teams[0],
      teamB: teams[5] || teams[1],
      scoreA: 1,
      scoreB: 1,
      currentMap: maps[2],
      event: 'League Match',
      round: 'Day 1',
      bestOf: 3,
    },
  ]
}

export async function fetchResults(teams: Team[]): Promise<CompletedMatch[]> {
  if (teams.length === 0) return []
  return [
    {
      id: 'res-1',
      teamA: teams[0],
      teamB: teams[1],
      scoreA: 2,
      scoreB: 0,
      event: 'League Match',
      round: 'Day 5',
    },
    {
      id: 'res-2',
      teamA: teams[2] || teams[0],
      teamB: teams[3] || teams[1],
      scoreA: 1,
      scoreB: 2,
      event: 'League Match',
      round: 'Day 5',
    },
    {
      id: 'res-3',
      teamA: teams[4] || teams[0],
      teamB: teams[5] || teams[1],
      scoreA: 2,
      scoreB: 1,
      event: 'League Match',
      round: 'Day 6',
    },
    {
      id: 'res-4',
      teamA: teams[1],
      teamB: teams[3] || teams[1],
      scoreA: 0,
      scoreB: 2,
      event: 'League Match',
      round: 'Day 6',
    },
  ]
}

let cache: { teams: Team[]; ts: number } | null = null
const TTL = 5 * 60 * 1000

export async function getTeams(): Promise<Team[]> {
  if (cache && Date.now() - cache.ts < TTL) return cache.teams
  const teams = await fetchTeams()
  cache = { teams, ts: Date.now() }
  return teams
}

export const TEAMS: Team[] = []

