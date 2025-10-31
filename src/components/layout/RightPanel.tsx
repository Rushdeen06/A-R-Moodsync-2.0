import React from 'react'
import { useSelector } from 'react-redux'
import {
  makeStyles,
  Text,
  Avatar,
  tokens,
} from '@fluentui/react-components'
import { RootState } from '../../store/store'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  
  header: {
    padding: '16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  content: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
  },
  
  section: {
    marginBottom: '24px',
  },
  
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '12px',
    color: tokens.colorNeutralForeground1,
  },
  
  teamMood: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '8px',
    marginBottom: '16px',
  },
  
  moodScore: {
    fontSize: '32px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    marginBottom: '4px',
  },
  
  moodLabel: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
  
  usersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  userItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: tokens.colorNeutralForeground1,
  },
  
  userStatus: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  
  quickStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  
  statCard: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '6px',
    textAlign: 'center',
  },
  
  statValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: tokens.colorBrandForeground1,
    marginBottom: '4px',
  },
  
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
})

const RightPanel: React.FC = () => {
  const styles = useStyles()
  const { users } = useSelector((state: RootState) => state.user)
  const { entries } = useSelector((state: RootState) => state.mood)
  
  // Calculate team mood average
  const moodScores: Record<string, number> = {
    happy: 10, excited: 9, content: 8, motivated: 9, neutral: 5,
    tired: 4, stressed: 3, frustrated: 2, anxious: 2, sad: 1
  }
  
  const averageMood = entries.length > 0 
    ? entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0) / entries.length 
    : 5
  
  const getMoodLabel = (score: number) => {
    if (score >= 8) return 'Great'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Okay'
    return 'Needs Attention'
  }

  const todaysEntries = entries.filter(entry => {
    const today = new Date().toDateString()
    return new Date(entry.timestamp).toDateString() === today
  }).length

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text weight="semibold" size={400}>Team Insights</Text>
      </div>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Team Mood</Text>
          <div className={styles.teamMood}>
            <div className={styles.moodScore}>{averageMood.toFixed(1)}</div>
            <div className={styles.moodLabel}>{getMoodLabel(averageMood)}</div>
          </div>
        </div>

        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Quick Stats</Text>
          <div className={styles.quickStats}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{todaysEntries}</div>
              <div className={styles.statLabel}>Today's Check-ins</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{users.filter(u => u.status === 'online').length}</div>
              <div className={styles.statLabel}>Online Now</div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <Text className={styles.sectionTitle}>Team Members</Text>
          <div className={styles.usersList}>
            {users.map((user) => (
              <div key={user.id} className={styles.userItem}>
                <Avatar 
                  name={user.name} 
                  size={32}
                  badge={{ 
                    status: user.status === 'online' ? 'available' : 
                           user.status === 'busy' ? 'busy' : 
                           user.status === 'away' ? 'away' : 'offline'
                  }}
                />
                <div className={styles.userInfo}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userStatus}>{user.department}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RightPanel