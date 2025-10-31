import React from 'react'
import {
  makeStyles,
  Text,
  Spinner,
  tokens,
} from '@fluentui/react-components'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '24px',
    gap: '16px',
  },
  
  fullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: tokens.colorNeutralBackground2,
    zIndex: 9999,
  },
  
  message: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
  },
  
  subMessage: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
    marginTop: '4px',
  }
})

interface LoadingSpinnerProps {
  message?: string
  subMessage?: string
  fullScreen?: boolean
  size?: 'tiny' | 'extra-small' | 'small' | 'medium' | 'large' | 'extra-large' | 'huge'
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  subMessage,
  fullScreen = false,
  size = 'medium'
}) => {
  const styles = useStyles()
  
  const containerClass = fullScreen 
    ? `${styles.container} ${styles.fullScreen}` 
    : styles.container

  return (
    <div className={containerClass}>
      <Spinner size={size} />
      <div>
        <Text className={styles.message}>{message}</Text>
        {subMessage && (
          <Text className={styles.subMessage}>{subMessage}</Text>
        )}
      </div>
    </div>
  )
}

export default LoadingSpinner