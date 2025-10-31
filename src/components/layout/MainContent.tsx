import React from 'react'
import { useSelector } from 'react-redux'
import {
  makeStyles,
  Text,
  tokens,
} from '@fluentui/react-components'
import { RootState } from '../../store/store'
import MoodEntryForm from '../mood/MoodEntryForm'
import MoodFeed from '../mood/MoodFeed'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  
  header: {
    padding: '16px 24px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  
  channelName: {
    fontSize: '20px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  
  channelDescription: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
  
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  
  feedContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 24px',
  },
  
  entryFormContainer: {
    padding: '16px 24px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
  },
})

const MainContent: React.FC = () => {
  const styles = useStyles()
  const { channels, selectedChannelId } = useSelector((state: RootState) => state.channel)
  
  const selectedChannel = channels.find(c => c.id === selectedChannelId)

  if (!selectedChannel) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Text className={styles.channelName}>Select a Channel</Text>
          <Text className={styles.channelDescription}>
            Choose a mood channel to start tracking and sharing
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.channelName}>
          {selectedChannel.icon} {selectedChannel.name}
        </Text>
        <Text className={styles.channelDescription}>
          {selectedChannel.description}
        </Text>
      </div>
      
      <div className={styles.content}>
        <div className={styles.feedContainer}>
          <MoodFeed channelId={selectedChannel.id} />
        </div>
        
        <div className={styles.entryFormContainer}>
          <MoodEntryForm channelId={selectedChannel.id} />
        </div>
      </div>
    </div>
  )
}

export default MainContent