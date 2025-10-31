import { MoodEntry, User, MoodChannel } from '../types'

const STORAGE_KEYS = {
  MOOD_ENTRIES: 'moodSync_entries',
  CURRENT_USER: 'moodSync_currentUser',
  USERS: 'moodSync_users',
  CHANNELS: 'moodSync_channels',
  SELECTED_CHANNEL: 'moodSync_selectedChannel',
  APP_VERSION: 'moodSync_version'
} as const

const APP_VERSION = '1.0.0'

class LocalStorageService {
  private isAvailable(): boolean {
    try {
      const testKey = '__localStorage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch {
      return false
    }
  }

  private safeGetItem<T>(key: string, defaultValue: T): T {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available, using default value')
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue
      
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  private safeSetItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available, cannot save data')
      return false
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error)
      return false
    }
  }

  // Version management
  checkVersion(): boolean {
    const storedVersion = this.safeGetItem(STORAGE_KEYS.APP_VERSION, null)
    if (storedVersion !== APP_VERSION) {
      this.clearAll()
      this.safeSetItem(STORAGE_KEYS.APP_VERSION, APP_VERSION)
      return false // Data was cleared due to version mismatch
    }
    return true
  }

  // Mood entries
  getMoodEntries(): MoodEntry[] {
    const entries = this.safeGetItem<MoodEntry[]>(STORAGE_KEYS.MOOD_ENTRIES, [])
    // Convert timestamp strings back to Date objects
    return entries.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
      reactions: entry.reactions?.map(reaction => ({
        ...reaction,
        timestamp: new Date(reaction.timestamp)
      })) || []
    }))
  }

  saveMoodEntries(entries: MoodEntry[]): boolean {
    return this.safeSetItem(STORAGE_KEYS.MOOD_ENTRIES, entries)
  }

  addMoodEntry(entry: MoodEntry): boolean {
    const entries = this.getMoodEntries()
    entries.unshift(entry) // Add to beginning for chronological order
    return this.saveMoodEntries(entries)
  }

  // User management
  getCurrentUser(): User | null {
    return this.safeGetItem<User | null>(STORAGE_KEYS.CURRENT_USER, null)
  }

  saveCurrentUser(user: User): boolean {
    return this.safeSetItem(STORAGE_KEYS.CURRENT_USER, user)
  }

  getUsers(): User[] {
    return this.safeGetItem<User[]>(STORAGE_KEYS.USERS, [])
  }

  saveUsers(users: User[]): boolean {
    return this.safeSetItem(STORAGE_KEYS.USERS, users)
  }

  // Channel management
  getChannels(): MoodChannel[] {
    return this.safeGetItem<MoodChannel[]>(STORAGE_KEYS.CHANNELS, [])
  }

  saveChannels(channels: MoodChannel[]): boolean {
    return this.safeSetItem(STORAGE_KEYS.CHANNELS, channels)
  }

  getSelectedChannel(): string | null {
    return this.safeGetItem<string | null>(STORAGE_KEYS.SELECTED_CHANNEL, null)
  }

  saveSelectedChannel(channelId: string): boolean {
    return this.safeSetItem(STORAGE_KEYS.SELECTED_CHANNEL, channelId)
  }

  // Bulk operations
  exportData(): string {
    const data = {
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      entries: this.getMoodEntries(),
      currentUser: this.getCurrentUser(),
      users: this.getUsers(),
      channels: this.getChannels(),
      selectedChannel: this.getSelectedChannel()
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.entries) this.saveMoodEntries(data.entries)
      if (data.currentUser) this.saveCurrentUser(data.currentUser)
      if (data.users) this.saveUsers(data.users)
      if (data.channels) this.saveChannels(data.channels)
      if (data.selectedChannel) this.saveSelectedChannel(data.selectedChannel)
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  clearAll(): void {
    if (!this.isAvailable()) return

    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key)
      } catch (error) {
        console.error(`Error removing localStorage key "${key}":`, error)
      }
    })
  }

  // Analytics
  getStorageUsage(): { used: number; total: number; percentage: number } {
    if (!this.isAvailable()) {
      return { used: 0, total: 0, percentage: 0 }
    }

    try {
      let used = 0
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Rough estimate of localStorage limit (5MB in most browsers)
      const total = 5 * 1024 * 1024
      const percentage = (used / total) * 100

      return { used, total, percentage }
    } catch {
      return { used: 0, total: 0, percentage: 0 }
    }
  }
}

export const storageService = new LocalStorageService()
export default storageService