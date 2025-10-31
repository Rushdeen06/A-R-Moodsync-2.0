import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MoodChannel } from '../../types'

interface ChannelState {
  channels: MoodChannel[]
  selectedChannelId: string | null
  isLoading: boolean
  error: string | null
}

const initialChannels: MoodChannel[] = [
  {
    id: 'general',
    name: 'General',
    description: 'General mood updates and check-ins',
    color: '#6264A7',
    icon: '💬',
    memberCount: 24,
    isActive: true
  },
  {
    id: 'happy',
    name: 'Happy Vibes',
    description: 'Share your good moments and wins',
    color: '#00BCF2',
    icon: '😊',
    memberCount: 18,
    isActive: true
  },
  {
    id: 'stressed',
    name: 'Stress Support',
    description: 'Support each other through challenging times',
    color: '#FF8C00',
    icon: '😰',
    memberCount: 12,
    isActive: true
  },
  {
    id: 'motivated',
    name: 'Motivation Station',
    description: 'Share goals and inspire each other',
    color: '#237B4B',
    icon: '💪',
    memberCount: 20,
    isActive: true
  },
  {
    id: 'wellness',
    name: 'Wellness Tips',
    description: 'Mental health resources and tips',
    color: '#8B5A9A',
    icon: '🧘‍♀️',
    memberCount: 15,
    isActive: true
  }
]

const initialState: ChannelState = {
  channels: initialChannels,
  selectedChannelId: 'general',
  isLoading: false,
  error: null,
}

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setSelectedChannel: (state, action: PayloadAction<string>) => {
      state.selectedChannelId = action.payload
    },
    
    setChannels: (state, action: PayloadAction<MoodChannel[]>) => {
      state.channels = action.payload
    },
    
    addChannel: (state, action: PayloadAction<MoodChannel>) => {
      state.channels.push(action.payload)
    },
    
    updateChannel: (state, action: PayloadAction<Partial<MoodChannel> & { id: string }>) => {
      const channel = state.channels.find(c => c.id === action.payload.id)
      if (channel) {
        Object.assign(channel, action.payload)
      }
    },
    
    updateMemberCount: (state, action: PayloadAction<{ channelId: string; count: number }>) => {
      const channel = state.channels.find(c => c.id === action.payload.channelId)
      if (channel) {
        channel.memberCount = action.payload.count
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  }
})

export const {
  setSelectedChannel,
  setChannels,
  addChannel,
  updateChannel,
  updateMemberCount,
  setLoading,
  setError
} = channelSlice.actions

export default channelSlice.reducer