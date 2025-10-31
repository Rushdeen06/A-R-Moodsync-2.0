import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MoodEntry, MoodStats, MoodType } from '../../types'
import { sampleMoodEntries } from '../../utils/sampleData'

interface MoodState {
  entries: MoodEntry[]
  stats: MoodStats | null
  isLoading: boolean
  error: string | null
}

const initialStats: MoodStats = {
  totalEntries: 0,
  averageMood: 5,
  trendDirection: 'stable',
  mostCommonMood: 'neutral',
  dailyEntries: []
}

const initialState: MoodState = {
  entries: sampleMoodEntries.map((entry, index) => ({
    ...entry,
    id: (index + 1).toString(),
    timestamp: new Date(Date.now() - index * 2 * 60 * 60 * 1000), // Spread entries over last few hours
  })),
  stats: initialStats,
  isLoading: false,
  error: null,
}

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    addMoodEntry: (state, action: PayloadAction<Omit<MoodEntry, 'id' | 'timestamp'>>) => {
      const newEntry: MoodEntry = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date(),
      }
      state.entries.unshift(newEntry)
      
      // Update stats
      if (state.stats) {
        state.stats.totalEntries += 1
        // Simple mood scoring: happy=10, excited=9, content=8, neutral=5, tired=4, stressed=3, frustrated=2, sad=1, anxious=2, motivated=9
        const moodScores: Record<MoodType, number> = {
          happy: 10, excited: 9, content: 8, motivated: 9, neutral: 5,
          tired: 4, stressed: 3, frustrated: 2, anxious: 2, sad: 1
        }
        const totalScore = state.entries.reduce((sum, entry) => sum + moodScores[entry.mood], 0)
        state.stats.averageMood = totalScore / state.entries.length
      }
    },
    
    setMoodEntries: (state, action: PayloadAction<MoodEntry[]>) => {
      state.entries = action.payload
    },
    
    updateMoodStats: (state, action: PayloadAction<MoodStats>) => {
      state.stats = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    addReaction: (state, action: PayloadAction<{ entryId: string; userId: string; emoji: string }>) => {
      const entry = state.entries.find(e => e.id === action.payload.entryId)
      if (entry) {
        if (!entry.reactions) entry.reactions = []
        entry.reactions.push({
          id: Date.now().toString(),
          userId: action.payload.userId,
          emoji: action.payload.emoji,
          timestamp: new Date()
        })
      }
    }
  }
})

export const {
  addMoodEntry,
  setMoodEntries,
  updateMoodStats,
  setLoading,
  setError,
  addReaction
} = moodSlice.actions

export default moodSlice.reducer