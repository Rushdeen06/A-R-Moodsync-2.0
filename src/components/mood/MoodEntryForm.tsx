import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  makeStyles,
  Button,
  Text,
  Textarea,
  tokens,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
} from '@fluentui/react-components'
import { ChevronDown24Regular, Send24Regular } from '@fluentui/react-icons'
import { RootState } from '../../store/store'
import { addMoodEntry } from '../../store/slices/moodSlice'
import { MoodType } from '../../types'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  
  moodSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  
  moodButton: {
    minWidth: '140px',
    justifyContent: 'space-between',
  },
  
  selectedMood: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  messageInput: {
    minHeight: '80px',
    resize: 'vertical',
  },
  
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  charCount: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
})

interface MoodEntryFormProps {
  channelId: string
}

const moodOptions: { value: MoodType; label: string; emoji: string; color: string }[] = [
  { value: 'happy', label: 'Happy', emoji: '😊', color: '#00BCF2' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: '#FF8C00' },
  { value: 'content', label: 'Content', emoji: '😌', color: '#237B4B' },
  { value: 'motivated', label: 'Motivated', emoji: '💪', color: '#6264A7' },
  { value: 'neutral', label: 'Neutral', emoji: '😐', color: '#666666' },
  { value: 'tired', label: 'Tired', emoji: '😴', color: '#8B5A9A' },
  { value: 'stressed', label: 'Stressed', emoji: '😰', color: '#D83B01' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😤', color: '#E74856' },
  { value: 'anxious', label: 'Anxious', emoji: '😟', color: '#CA5010' },
  { value: 'sad', label: 'Sad', emoji: '😢', color: '#005A6B' },
]

const MoodEntryForm: React.FC<MoodEntryFormProps> = ({ channelId }) => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state: RootState) => state.user)
  
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedMoodOption = moodOptions.find(m => m.value === selectedMood)!

  const handleSubmit = async () => {
    if (!currentUser) return
    
    setIsSubmitting(true)
    
    try {
      dispatch(addMoodEntry({
        userId: currentUser.id,
        user: currentUser,
        mood: selectedMood,
        message: message.trim() || undefined,
        channelId,
        reactions: []
      }))
      
      setMessage('')
      setSelectedMood('neutral')
    } catch (error) {
      console.error('Failed to submit mood entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const maxLength = 280

  return (
    <div className={styles.container}>
      <div className={styles.moodSelector}>
        <Text size={300} weight="medium">How are you feeling?</Text>
        
        <Menu>
          <MenuTrigger disableButtonEnhancement>
            <MenuButton 
              className={styles.moodButton}
            >
              <div className={styles.selectedMood}>
                <span>{selectedMoodOption.emoji}</span>
                <span>{selectedMoodOption.label}</span>
                <ChevronDown24Regular style={{ marginLeft: 'auto' }} />
              </div>
            </MenuButton>
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              {moodOptions.map((mood) => (
                <MenuItem 
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{mood.emoji}</span>
                    <span>{mood.label}</span>
                  </div>
                </MenuItem>
              ))}
            </MenuList>
          </MenuPopover>
        </Menu>
      </div>

      <Textarea
        className={styles.messageInput}
        placeholder={`Share what's on your mind... (optional)`}
        value={message}
        onChange={(_, data) => setMessage(data.value)}
        maxLength={maxLength}
      />

      <div className={styles.actions}>
        <Text className={styles.charCount}>
          {message.length}/{maxLength}
        </Text>
        
        <Button
          className={styles.submitButton}
          appearance="primary"
          disabled={isSubmitting}
          onClick={handleSubmit}
          icon={<Send24Regular />}
        >
          {isSubmitting ? 'Sharing...' : 'Share Mood'}
        </Button>
      </div>
    </div>
  )
}

export default MoodEntryForm