import React, { Component, ErrorInfo, ReactNode } from 'react'
import {
  makeStyles,
  Text,
  Button,
  Card,
  tokens,
} from '@fluentui/react-components'
import { Warning24Regular, ArrowClockwise24Regular } from '@fluentui/react-icons'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

const useStyles = makeStyles({
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    padding: '24px',
  },
  
  errorCard: {
    padding: '32px',
    textAlign: 'center',
    maxWidth: '500px',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorStatusDangerBackground1}`,
  },
  
  errorIcon: {
    fontSize: '48px',
    color: tokens.colorStatusDangerForeground1,
    marginBottom: '16px',
  },
  
  errorTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
  },
  
  errorMessage: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  
  retryButton: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
  
  details: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    textAlign: 'left',
    maxHeight: '200px',
    overflow: 'auto',
  }
})

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Log to external service if available
    this.logError(error, errorInfo)
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  private logError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, send to error tracking service like Sentry
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.error('Error logged:', errorData)
    
    // Example: Send to error tracking service
    // trackError(errorData)
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorDisplay 
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onRetry={this.handleRetry}
        onReload={this.handleReload}
      />
    }

    return this.props.children
  }
}

interface ErrorDisplayProps {
  error: Error | null
  errorInfo: ErrorInfo | null
  onRetry: () => void
  onReload: () => void
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, errorInfo, onRetry, onReload }) => {
  const styles = useStyles()
  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <div className={styles.errorContainer}>
      <Card className={styles.errorCard}>
        <div className={styles.errorIcon}>
          <Warning24Regular />
        </div>
        
        <Text className={styles.errorTitle}>
          Oops! Something went wrong
        </Text>
        
        <Text className={styles.errorMessage}>
          We're sorry, but something unexpected happened. This error has been logged 
          and we'll work to fix it. You can try refreshing the page or going back.
        </Text>
        
        <div className={styles.actions}>
          <Button 
            className={styles.retryButton}
            onClick={onRetry}
            icon={<ArrowClockwise24Regular />}
          >
            Try Again
          </Button>
          
          <Button 
            appearance="secondary"
            onClick={onReload}
          >
            Reload Page
          </Button>
        </div>

        {error && (
          <div style={{ marginTop: '16px' }}>
            <Button
              appearance="subtle"
              size="small"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Error Details
            </Button>
            
            {showDetails && (
              <div className={styles.details}>
                <strong>Error:</strong> {error.message}<br/>
                <strong>Stack:</strong><br/>
                <pre>{error.stack}</pre>
                {errorInfo && (
                  <>
                    <strong>Component Stack:</strong><br/>
                    <pre>{errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

export default ErrorBoundary