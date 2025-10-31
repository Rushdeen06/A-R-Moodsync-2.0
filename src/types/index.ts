export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  department: string;
  role: string;
  phone?: string;
  bio?: string;
  joinDate: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  user: User;
  mood: MoodType;
  message?: string;
  timestamp: Date;
  channelId: string;
  reactions?: Reaction[];
}

export interface MoodChannel {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  memberCount: number;
  isActive: boolean;
}

export interface Reaction {
  id: string;
  userId: string;
  emoji: string;
  timestamp: Date;
}

export type MoodType = 
  | 'happy'
  | 'excited'
  | 'content'
  | 'neutral'
  | 'tired'
  | 'stressed'
  | 'frustrated'
  | 'sad'
  | 'anxious'
  | 'motivated';

export interface MoodStats {
  totalEntries: number;
  averageMood: number;
  trendDirection: 'up' | 'down' | 'stable';
  mostCommonMood: MoodType;
  dailyEntries: { date: string; count: number; averageMood: number }[];
}

export interface AppState {
  user: User | null;
  selectedChannel: string | null;
  isLoading: boolean;
  error: string | null;
}