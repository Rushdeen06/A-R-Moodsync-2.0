import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { 
  makeStyles,
  tokens
} from '@fluentui/react-components'
import Sidebar from './Sidebar'
import AppRouter from '../AppRouter'
import RightPanel from './RightPanel'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  
  sidebar: {
    width: '280px',
    minWidth: '280px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
  },
  
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
    overflow: 'hidden',
  },
  
  rightPanel: {
    width: '320px',
    minWidth: '320px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
  }
})

const MainLayout: React.FC = () => {
  const styles = useStyles()

  return (
    <Router basename="/A-R-Moodsync-2.0">
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        
        <div className={styles.mainArea}>
          <AppRouter />
        </div>
        
        <div className={styles.rightPanel}>
          <RightPanel />
        </div>
      </div>
    </Router>
  )
}

export default MainLayout