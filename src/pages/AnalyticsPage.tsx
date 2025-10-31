import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  makeStyles,
  Text,
  Card,
  tokens,
  Button,
} from '@fluentui/react-components'
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, subDays, startOfDay } from 'date-fns'
import { RootState } from '../store/store'
import { MoodType } from '../types'

const useStyles = makeStyles({
  container: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground2,
    height: '100%',
    overflowY: 'auto',
  },
  
  header: {
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  
  subtitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  
  statCard: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    marginBottom: '4px',
  },
  
  statLabel: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '8px',
  },
  
  statChange: {
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  
  positive: {
    color: tokens.colorPaletteGreenForeground1,
  },
  
  negative: {
    color: tokens.colorPaletteRedForeground1,
  },
  
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  
  chartCard: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '16px',
  },
  
  fullWidthChart: {
    gridColumn: '1 / -1',
  },
  
  exportSection: {
    marginTop: '32px',
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
})

const AnalyticsPage: React.FC = () => {
  const styles = useStyles()
  const { entries } = useSelector((state: RootState) => state.mood)
  const { users } = useSelector((state: RootState) => state.user)

  const moodColors: Record<MoodType, string> = {
    happy: '#00BCF2',
    excited: '#FF8C00', 
    content: '#237B4B',
    motivated: '#6264A7',
    neutral: '#666666',
    tired: '#8B5A9A',
    stressed: '#D83B01',
    frustrated: '#E74856',
    anxious: '#CA5010',
    sad: '#005A6B',
  }

  const moodScores: Record<MoodType, number> = {
    happy: 10, excited: 9, content: 8, motivated: 9, neutral: 5,
    tired: 4, stressed: 3, frustrated: 2, anxious: 2, sad: 1
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length
    const averageMood = totalEntries > 0 
      ? entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0) / totalEntries 
      : 5

    // Get entries from last 7 days
    const last7Days = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp)
      const weekAgo = subDays(new Date(), 7)
      return entryDate >= weekAgo
    })

    // Get entries from previous 7 days for comparison
    const previous7Days = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp)
      const twoWeeksAgo = subDays(new Date(), 14)
      const weekAgo = subDays(new Date(), 7)
      return entryDate >= twoWeeksAgo && entryDate < weekAgo
    })

    const weeklyChange = ((last7Days.length - previous7Days.length) / Math.max(previous7Days.length, 1)) * 100

    // Most common mood
    const moodCounts: Record<string, number> = {}
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    })
    const mostCommonMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b, 'neutral'
    )

    // Active users (users who posted in last 7 days)
    const activeUsers = new Set(last7Days.map(entry => entry.userId)).size

    return {
      totalEntries,
      averageMood,
      weeklyChange,
      mostCommonMood,
      activeUsers,
      last7Days: last7Days.length
    }
  }, [entries])

  // Prepare daily trend data
  const dailyTrendData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i)
      const dayStart = startOfDay(date)
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
      
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.timestamp)
        return entryDate >= dayStart && entryDate < dayEnd
      })

      const averageMood = dayEntries.length > 0
        ? dayEntries.reduce((sum, entry) => sum + moodScores[entry.mood], 0) / dayEntries.length
        : 0

      return {
        date: format(date, 'MMM dd'),
        entries: dayEntries.length,
        averageMood: Number(averageMood.toFixed(1)),
        mood: averageMood
      }
    })

    return last30Days
  }, [entries])

  // Prepare mood distribution data
  const moodDistributionData = useMemo(() => {
    const moodCounts: Record<string, number> = {}
    entries.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1
    })

    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood: mood.charAt(0).toUpperCase() + mood.slice(1),
      count,
      percentage: ((count / entries.length) * 100).toFixed(1),
      color: moodColors[mood as MoodType]
    }))
  }, [entries])

  // Prepare team activity data
  const teamActivityData = useMemo(() => {
    const userCounts: Record<string, number> = {}
    entries.forEach(entry => {
      const userName = entry.user.name
      userCounts[userName] = (userCounts[userName] || 0) + 1
    })

    return Object.entries(userCounts)
      .map(([name, count]) => ({
        name,
        entries: count,
        department: users.find(u => u.name === name)?.department || 'Unknown'
      }))
      .sort((a, b) => b.entries - a.entries)
      .slice(0, 10)
  }, [entries, users])

  const exportData = () => {
    const data = {
      summary: stats,
      dailyTrends: dailyTrendData,
      moodDistribution: moodDistributionData,
      teamActivity: teamActivityData,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mood-analytics-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Analytics Dashboard</Text>
        <Text className={styles.subtitle}>
          Comprehensive insights into team mood patterns and trends
        </Text>
      </div>

      {/* Key Statistics */}
      <div className={styles.statsGrid}>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{stats.totalEntries}</Text>
          <Text className={styles.statLabel}>Total Mood Entries</Text>
          <Text className={`${styles.statChange} ${stats.weeklyChange >= 0 ? styles.positive : styles.negative}`}>
            {stats.weeklyChange >= 0 ? '+' : ''}{stats.weeklyChange.toFixed(1)}% from last week
          </Text>
        </Card>

        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{stats.averageMood.toFixed(1)}</Text>
          <Text className={styles.statLabel}>Average Team Mood</Text>
          <Text className={styles.statChange}>
            {stats.averageMood >= 7 ? 'Excellent' : 
             stats.averageMood >= 5 ? 'Good' : 
             stats.averageMood >= 3 ? 'Needs Attention' : 'Critical'}
          </Text>
        </Card>

        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{stats.activeUsers}</Text>
          <Text className={styles.statLabel}>Active Team Members</Text>
          <Text className={styles.statChange}>
            {stats.last7Days} entries this week
          </Text>
        </Card>

        <Card className={styles.statCard}>
          <Text className={styles.statValue}>
            {stats.mostCommonMood.charAt(0).toUpperCase() + stats.mostCommonMood.slice(1)}
          </Text>
          <Text className={styles.statLabel}>Most Common Mood</Text>
          <Text className={styles.statChange}>
            Based on recent entries
          </Text>
        </Card>
      </div>

      {/* Charts */}
      <div className={styles.chartsGrid}>
        {/* Daily Mood Trend */}
        <Card className={`${styles.chartCard} ${styles.fullWidthChart}`}>
          <Text className={styles.chartTitle}>30-Day Mood Trend</Text>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip 
                labelFormatter={(value) => `Date: ${value}`}
                formatter={(value: any, name: string) => [
                  name === 'averageMood' ? `${value}/10` : value,
                  name === 'averageMood' ? 'Average Mood' : 'Entries'
                ]}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="averageMood" 
                stroke="#6264A7" 
                fill="#6264A7" 
                fillOpacity={0.3}
                name="Average Mood"
              />
              <Line 
                type="monotone" 
                dataKey="entries" 
                stroke="#00BCF2" 
                strokeWidth={2}
                name="Daily Entries"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood Distribution */}
        <Card className={styles.chartCard}>
          <Text className={styles.chartTitle}>Mood Distribution</Text>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ mood, percentage }) => `${mood}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {moodDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Activity */}
        <Card className={styles.chartCard}>
          <Text className={styles.chartTitle}>Team Activity</Text>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="entries" fill="#6264A7" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Export Section */}
      <Card className={styles.exportSection}>
        <Text className={styles.chartTitle}>Export Analytics</Text>
        <Text style={{ marginBottom: '16px', color: tokens.colorNeutralForeground2 }}>
          Download comprehensive analytics data for further analysis
        </Text>
        <Button 
          appearance="primary" 
          onClick={exportData}
        >
          Export Data (JSON)
        </Button>
      </Card>
    </div>
  )
}

export default AnalyticsPage