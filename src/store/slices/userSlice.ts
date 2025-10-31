import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from '../../types'

interface UserState {
  currentUser: User | null
  users: User[]
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: {
    id: '1',
    name: 'You',
    email: 'user@company.com',
    avatar: '',
    status: 'online',
    department: 'Development',
    role: 'Senior Developer',
    joinDate: '2024-01-15'
  },
  users: [
    {
      id: '1',
      name: 'You',
      email: 'user@company.com',
      avatar: '',
      status: 'online',
      department: 'Development',
      role: 'Senior Developer',
      joinDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      avatar: '',
      status: 'online',
      department: 'Design',
      role: 'UX Designer',
      joinDate: '2024-02-01'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike.c@company.com',
      avatar: '',
      status: 'away',
      department: 'Development',
      role: 'Frontend Developer',
      joinDate: '2024-03-10'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@company.com',
      avatar: '',
      status: 'busy',
      department: 'Marketing',
      role: 'Marketing Manager',
      joinDate: '2023-12-05'
    }
  ],
  isAuthenticated: true,
  isLoading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
    },
    
    updateUserStatus: (state, action: PayloadAction<{ userId: string; status: User['status'] }>) => {
      const user = state.users.find(u => u.id === action.payload.userId)
      if (user) {
        user.status = action.payload.status
      }
      if (state.currentUser?.id === action.payload.userId) {
        state.currentUser.status = action.payload.status
      }
    },
    
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
    
    logout: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
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
  setCurrentUser,
  updateUserStatus,
  addUser,
  setUsers,
  logout,
  setLoading,
  setError
} = userSlice.actions

export default userSlice.reducer