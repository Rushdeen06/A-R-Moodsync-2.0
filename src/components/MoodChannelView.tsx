import React from 'react'
import { useSelector } from 'react-redux'
import { makeStyles, Text, tokens } from '@fluentui/react-components'
import { RootState } from '../store/store'
import MoodFeed from './mood/MoodFeed'
import MoodEntryForm from './mood/MoodEntryForm'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  
  header: {
    padding: '16px 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  channelTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
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
  
  feedArea: {
    flex: 1,
    overflow: 'hidden',
  },
  
  formArea: {
    padding: '16px 24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  noChannelSelected: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: tokens.colorNeutralForeground2,
    fontSize: '16px',
  },
})

const MoodChannelView: React.FC = () => {
  const styles = useStyles()
  const { channels, selectedChannelId } = useSelector((state: RootState) => state.channel)
  
  const selectedChannel = channels.find(c => c.id === selectedChannelId)
  
  if (!selectedChannel) {
    return (
      <div className={styles.noChannelSelected}>
        <Text>No channel selected</Text>
        <Text>Please select a mood channel from the sidebar</Text>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.channelTitle}>
          {selectedChannel.icon} {selectedChannel.name}
        </Text>
        <Text className={styles.channelDescription}>
          {selectedChannel.description}
        </Text>
      </div>
      
      <div className={styles.content}>
        <div className={styles.feedArea}>
          <MoodFeed channelId={selectedChannel.id} />
        </div>
        
        <div className={styles.formArea}>
          <MoodEntryForm channelId={selectedChannel.id} />
        </div>
      </div>
    </div>
  )
}

export default MoodChannelView