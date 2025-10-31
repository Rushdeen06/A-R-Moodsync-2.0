import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  makeStyles,
  Text,
  Avatar,
  Button,
  Card,
  tokens,
} from '@fluentui/react-components'
import { 
  Heart24Regular, 
  Heart24Filled,
  ThumbLike24Regular,
  ThumbLike24Filled,
  EmojiAdd24Regular 
} from '@fluentui/react-icons'
import { format, isToday, isYesterday } from 'date-fns'
import { RootState } from '../../store/store'
import { addReaction } from '../../store/slices/moodSlice'
import { MoodEntry, MoodType } from '../../types'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  
  emptyState: {
    textAlign: 'center',
    padding: '48px 24px',
    color: tokens.colorNeutralForeground2,
  },
  
  entryCard: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    '&:hover': {
      boxShadow: tokens.shadow4,
    },
  },
  
  entryHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },
  
  userInfo: {
    flex: 1,
  },
  
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '2px',
  },
  
  timestamp: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  
  moodIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '500',
  },
  
  entryMessage: {
    fontSize: '14px',
    lineHeight: '1.4',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
    whiteSpace: 'pre-wrap',
  },
  
  entryActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  reactionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '16px',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '12px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground2,
    },
  },
  
  activeReaction: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  
  reactions: {
    display: 'flex',
    gap: '4px',
    marginLeft: 'auto',
  },
})

interface MoodFeedProps {
  channelId: string
}

const moodConfig: Record<MoodType, { emoji: string; label: string; color: string }> = {
  happy: { emoji: '😊', label: 'Happy', color: '#00BCF2' },
  excited: { emoji: '🤩', label: 'Excited', color: '#FF8C00' },
  content: { emoji: '😌', label: 'Content', color: '#237B4B' },
  motivated: { emoji: '💪', label: 'Motivated', color: '#6264A7' },
  neutral: { emoji: '😐', label: 'Neutral', color: '#666666' },
  tired: { emoji: '😴', label: 'Tired', color: '#8B5A9A' },
  stressed: { emoji: '😰', label: 'Stressed', color: '#D83B01' },
  frustrated: { emoji: '😤', label: 'Frustrated', color: '#E74856' },
  anxious: { emoji: '😟', label: 'Anxious', color: '#CA5010' },
  sad: { emoji: '😢', label: 'Sad', color: '#005A6B' },
}

const MoodFeed: React.FC<MoodFeedProps> = ({ channelId }) => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const { entries } = useSelector((state: RootState) => state.mood)
  const { currentUser } = useSelector((state: RootState) => state.user)

  const channelEntries = entries.filter(entry => entry.channelId === channelId)

  const formatTimestamp = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, yyyy \'at\' h:mm a')
    }
  }

  const handleReaction = (entryId: string, emoji: string) => {
    if (!currentUser) return
    
    dispatch(addReaction({
      entryId,
      userId: currentUser.id,
      emoji
    }))
  }

  const hasUserReacted = (entry: MoodEntry, emoji: string) => {
    return entry.reactions?.some(r => r.userId === currentUser?.id && r.emoji === emoji) || false
  }

  const getReactionCount = (entry: MoodEntry, emoji: string) => {
    return entry.reactions?.filter(r => r.emoji === emoji).length || 0
  }

  if (channelEntries.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <Text size={400}>No mood updates yet</Text>
          <Text size={300} style={{ display: 'block', marginTop: '8px' }}>
            Be the first to share how you're feeling!
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {channelEntries.map((entry) => {
        const moodInfo = moodConfig[entry.mood]
        const likeCount = getReactionCount(entry, '👍')
        const heartCount = getReactionCount(entry, '❤️')
        const userLiked = hasUserReacted(entry, '👍')
        const userHearted = hasUserReacted(entry, '❤️')

        return (
          <Card key={entry.id} className={styles.entryCard}>
            <div className={styles.entryHeader}>
              <Avatar name={entry.user.name} size={32} />
              
              <div className={styles.userInfo}>
                <div className={styles.userName}>{entry.user.name}</div>
                <div className={styles.timestamp}>
                  {formatTimestamp(new Date(entry.timestamp))}
                </div>
              </div>
              
              <div 
                className={styles.moodIndicator}
                style={{ 
                  backgroundColor: `${moodInfo.color}20`,
                  color: moodInfo.color,
                }}
              >
                <span>{moodInfo.emoji}</span>
                <span>{moodInfo.label}</span>
              </div>
            </div>

            {entry.message && (
              <div className={styles.entryMessage}>
                {entry.message}
              </div>
            )}

            <div className={styles.entryActions}>
              <Button
                className={`${styles.reactionButton} ${userLiked ? styles.activeReaction : ''}`}
                onClick={() => handleReaction(entry.id, '👍')}
                icon={userLiked ? <ThumbLike24Filled /> : <ThumbLike24Regular />}
              >
                {likeCount > 0 && likeCount}
              </Button>

              <Button
                className={`${styles.reactionButton} ${userHearted ? styles.activeReaction : ''}`}
                onClick={() => handleReaction(entry.id, '❤️')}
                icon={userHearted ? <Heart24Filled /> : <Heart24Regular />}
              >
                {heartCount > 0 && heartCount}
              </Button>

              <Button
                className={styles.reactionButton}
                icon={<EmojiAdd24Regular />}
              >
                React
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default MoodFeed