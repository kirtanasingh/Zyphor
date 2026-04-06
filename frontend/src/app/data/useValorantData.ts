import { useCallback, useEffect, useState } from 'react'
import {
  getTeams,
  fetchUpcomingMatches,
  fetchLiveMatches,
  fetchResults,
  type Team,
  type UpcomingMatch,
  type LiveMatch,
  type CompletedMatch,
} from './realData'

export function calcProbability(
  teamA: Team,
  teamB: Team,
  formA: 'HOT' | 'NEUTRAL' | 'COLD' = 'NEUTRAL',
  formB: 'HOT' | 'NEUTRAL' | 'COLD' = 'NEUTRAL',
  selectedMap = '',
  playerPerf = 50,
): { probA: number; probB: number } {
  const formMod: Record<'HOT' | 'NEUTRAL' | 'COLD', number> = { HOT: 1.15, NEUTRAL: 1.0, COLD: 0.85 }

  const scoreA =
    teamA.winRate * formMod[formA] +
    (16 - teamA.rank) * 1.5 +
    (selectedMap ? (teamA.mapStats.find((m) => m.map === selectedMap)?.winRate ?? 60) * 0.3 : 0) +
    playerPerf * 0.1

  const scoreB =
    teamB.winRate * formMod[formB] +
    (16 - teamB.rank) * 1.5 +
    (selectedMap ? (teamB.mapStats.find((m) => m.map === selectedMap)?.winRate ?? 60) * 0.3 : 0) +
    (100 - playerPerf) * 0.1

  const total = Math.max(1, scoreA + scoreB)
  const probA = Math.round((scoreA / total) * 100)
  return { probA, probB: 100 - probA }
}

export interface ValorantData {
  teams: Team[]
  upcoming: UpcomingMatch[]
  live: LiveMatch[]
  results: CompletedMatch[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useValorantData(region = 'na'): ValorantData {
  const [teams, setTeams] = useState<Team[]>([])
  const [upcoming, setUpcoming] = useState<UpcomingMatch[]>([])
  const [live, setLive] = useState<LiveMatch[]>([])
  const [results, setResults] = useState<CompletedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const t = await getTeams()
      setTeams(t)
      const [u, l, r] = await Promise.allSettled([
        fetchUpcomingMatches(t),
        fetchLiveMatches(t),
        fetchResults(t),
      ])
      if (u.status === 'fulfilled') setUpcoming(u.value)
      if (l.status === 'fulfilled') setLive(l.value)
      if (r.status === 'fulfilled') setResults(r.value)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [region])

  useEffect(() => {
    load()
  }, [load])

  return { teams, upcoming, live, results, loading, error, refetch: load }
}

export function useTeams(region = 'na') {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getTeams()
      .then((t) => {
        if (!cancelled) {
          setTeams(t)
          setLoading(false)
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [region])

  return { teams, loading, error }
}
