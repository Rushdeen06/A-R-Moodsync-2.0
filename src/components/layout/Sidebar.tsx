import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  makeStyles,
  Text,
  Avatar,
  Button,
  tokens
} from '@fluentui/react-components'
import {
  Chat24Regular,
  People24Regular,
  ChartMultiple24Regular,
  Settings24Regular,
  Add24Regular
} from '@fluentui/react-icons'
import { RootState } from '../../store/store'
import { setSelectedChannel } from '../../store/slices/channelSlice'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '16px 0',
  },
  
  header: {
    padding: '0 16px 16px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  
  navButton: {
    justifyContent: 'flex-start',
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  
  activeNavButton: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  
  channelsSection: {
    flex: 1,
    padding: '16px 0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px 8px 16px',
  },
  
  channelsList: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 8px',
  },
  
  channelButton: {
    width: '100%',
    justifyContent: 'space-between',
    padding: '8px 12px',
    marginBottom: '2px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  
  activeChannelButton: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground2,
    '&:hover': {
      backgroundColor: tokens.colorBrandBackground2Hover,
    },
  },
  
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  
  channelIcon: {
    fontSize: '16px',
  },
  
  memberCount: {
    fontSize: '11px',
    opacity: 0.7,
  },
})

const Sidebar: React.FC = () => {
  const styles = useStyles()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { currentUser } = useSelector((state: RootState) => state.user)
  const { channels, selectedChannelId } = useSelector((state: RootState) => state.channel)

  const handleChannelSelect = (channelId: string) => {
    dispatch(setSelectedChannel(channelId))
    navigate('/mood')
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  const isNavActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar 
            name={currentUser?.name} 
            size={32}
            badge={{ status: currentUser?.status === 'online' ? 'available' : 'away' }}
          />
          <div>
            <Text weight="semibold" size={300}>{currentUser?.name}</Text>
            <Text size={200} style={{ display: 'block', opacity: 0.7 }}>
              {currentUser?.department}
            </Text>
          </div>
        </div>
        
        <div className={styles.navigation}>
          <Button 
            className={`${styles.navButton} ${isNavActive('/mood') ? styles.activeNavButton : ''}`}
            icon={<Chat24Regular />}
            onClick={() => handleNavigation('/mood')}
          >
            Mood Channels
          </Button>
          <Button 
            className={`${styles.navButton} ${isNavActive('/analytics') ? styles.activeNavButton : ''}`}
            icon={<ChartMultiple24Regular />}
            onClick={() => handleNavigation('/analytics')}
          >
            Analytics
          </Button>
          <Button 
            className={`${styles.navButton} ${isNavActive('/team') ? styles.activeNavButton : ''}`}
            icon={<People24Regular />}
            onClick={() => handleNavigation('/team')}
          >
            Team Members
          </Button>
          <Button 
            className={`${styles.navButton} ${isNavActive('/settings') ? styles.activeNavButton : ''}`}
            icon={<Settings24Regular />}
            onClick={() => handleNavigation('/settings')}
          >
            Settings
          </Button>
        </div>
      </div>

      <div className={styles.channelsSection}>
        <div className={styles.sectionHeader}>
          <Text weight="semibold" size={300}>Channels</Text>
          <Button 
            size="small"
            appearance="subtle"
            icon={<Add24Regular />}
          />
        </div>
        
        <div className={styles.channelsList}>
          {channels.map((channel) => (
            <Button
              key={channel.id}
              className={`${styles.channelButton} ${
                selectedChannelId === channel.id ? styles.activeChannelButton : ''
              }`}
              onClick={() => handleChannelSelect(channel.id)}
            >
              <div className={styles.channelInfo}>
                <span className={styles.channelIcon}>{channel.icon}</span>
                <div>
                  <Text size={300} weight="regular">{channel.name}</Text>
                  <Text size={200} className={styles.memberCount}>
                    {channel.memberCount} members
                  </Text>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar