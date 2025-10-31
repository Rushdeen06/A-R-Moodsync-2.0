import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MoodChannelView from './MoodChannelView'
import AnalyticsPage from '../pages/AnalyticsPage'
import TeamMembersPage from '../pages/TeamMembersPage'
import SettingsPage from '../pages/SettingsPage'

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mood" replace />} />
      <Route path="/mood" element={<MoodChannelView />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/team" element={<TeamMembersPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/mood" replace />} />
    </Routes>
  )
}

export default AppRouter