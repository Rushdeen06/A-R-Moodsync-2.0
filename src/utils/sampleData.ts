import { MoodEntry } from '../types'

// Sample mood entries for demonstration
export const sampleMoodEntries: Omit<MoodEntry, 'id' | 'timestamp'>[] = [
  {
    userId: '2',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      avatar: '',
      status: 'online',
      department: 'Design',
      role: 'UX Designer',
      joinDate: '2024-02-01'
    },
    mood: 'excited',
    message: 'Just finished the new prototype! Can\'t wait to share it with the team 🎉',
    channelId: 'general',
    reactions: []
  },
  {
    userId: '3',
    user: {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.c@company.com',
      avatar: '',
      status: 'away',
      department: 'Development',
      role: 'Frontend Developer',
      joinDate: '2024-03-10'
    },
    mood: 'stressed',
    message: 'Dealing with some challenging bugs today. Taking it one step at a time.',
    channelId: 'stressed',
    reactions: []
  },
  {
    userId: '4',
    user: {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@company.com',
      avatar: '',
      status: 'busy',
      department: 'Marketing',
      role: 'Marketing Manager',
      joinDate: '2023-12-05'
    },
    mood: 'motivated',
    message: 'Starting the day with coffee and clear goals. Let\'s make it happen! ☕',
    channelId: 'motivated',
    reactions: []
  },
  {
    userId: '2',
    user: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      avatar: '',
      status: 'online',
      department: 'Design',
      role: 'UX Designer',
      joinDate: '2024-02-01'
    },
    mood: 'happy',
    message: 'Beautiful weather today! Perfect for a walking meeting ☀️',
    channelId: 'happy',
    reactions: []
  },
  {
    userId: '1',
    user: {
      id: '1',
      name: 'You',
      email: 'user@company.com',
      avatar: '',
      status: 'online',
      department: 'Development',
      role: 'Senior Developer',
      joinDate: '2024-01-15'
    },
    mood: 'content',
    message: 'Good productive morning session. Ready for lunch break!',
    channelId: 'general',
    reactions: []
  }
]