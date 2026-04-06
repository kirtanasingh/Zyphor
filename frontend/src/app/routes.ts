import { createBrowserRouter } from 'react-router'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { PredictionsPage } from './pages/PredictionsPage'
import { BracketPage } from './pages/BracketPage'
import { TeamsPage } from './pages/TeamsPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { LiveMatchesPage } from './pages/LiveMatchesPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'predictions', Component: PredictionsPage },
      { path: 'bracket', Component: BracketPage },
      { path: 'teams', Component: TeamsPage },
      { path: 'analytics', Component: AnalyticsPage },
      { path: 'live', Component: LiveMatchesPage },
    ],
  },
])
