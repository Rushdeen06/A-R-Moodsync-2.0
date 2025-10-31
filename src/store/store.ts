import { configureStore } from '@reduxjs/toolkit'
import moodReducer from './slices/moodSlice'
import userReducer from './slices/userSlice'
import channelReducer from './slices/channelSlice'

export const store = configureStore({
  reducer: {
    mood: moodReducer,
    user: userReducer,
    channel: channelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['mood/addEntry'],
        ignoredPaths: ['mood.entries.timestamp'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch