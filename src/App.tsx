import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/store'
import { setCurrentUser } from './store/slices/userSlice'
import { setMoodEntries } from './store/slices/moodSlice'
import { setChannels, setSelectedChannel } from './store/slices/channelSlice'
import MainLayout from './components/layout/MainLayout'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import storageService from './utils/storageService'
import './App.css'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      setIsLoading(true)
      
      // Check version and load data from localStorage
      const versionValid = storageService.checkVersion()
      
      if (versionValid) {
        // Load persisted data
        const savedEntries = storageService.getMoodEntries()
        const savedChannels = storageService.getChannels()
        const savedSelectedChannel = storageService.getSelectedChannel()
        
        if (savedEntries.length > 0) {
          dispatch(setMoodEntries(savedEntries))
        }
        
        if (savedChannels.length > 0) {
          dispatch(setChannels(savedChannels))
        }
        
        if (savedSelectedChannel) {
          dispatch(setSelectedChannel(savedSelectedChannel))
        }
      }
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (err) {
      console.error('Failed to initialize app:', err)
      setError('Failed to load application data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      
      // For demo purposes, automatically sign in the user
      if (currentUser) {
        dispatch(setCurrentUser(currentUser))
        storageService.saveCurrentUser(currentUser)
      }
      
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
    } catch (err) {
      console.error('Sign in failed:', err)
      setError('Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <LoadingSpinner 
        message="Loading Mood Sync..."
        subMessage="Please wait while we set up your workspace"
        fullScreen
        size="large"
      />
    )
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div className="error-container">
          <h2>Application Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      </ErrorBoundary>
    )
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <div className="login-container">
          <div className="login-card">
            <h1>Mood Sync</h1>
            <p>Team Mood Tracking</p>
            <button 
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </div>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="app">
        <MainLayout />
      </div>
    </ErrorBoundary>
  )
}

export default App