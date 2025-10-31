import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  makeStyles,
  Text,
  Card,
  Switch,
  Button,
  Input,
  Dropdown,
  Option,
  Textarea,
  tokens,
  MessageBar,
  MessageBarBody,
  TabList,
  Tab,
} from '@fluentui/react-components'
import {
  SettingsRegular,
  SaveRegular,
  DeleteRegular,
  ArrowDownloadRegular,
  ArrowUploadRegular,
  PaintBrushRegular,
  AlertRegular,
  ShieldRegular,
  DatabaseRegular,
} from '@fluentui/react-icons'
import { format } from 'date-fns'
import { RootState } from '../store/store'
import { storageService } from '../utils/storageService'

const useStyles = makeStyles({
  container: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground2,
    height: '100%',
    overflowY: 'auto',
  },
  
  header: {
    marginBottom: '32px',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '8px',
  },
  
  subtitle: {
    fontSize: '16px',
    color: tokens.colorNeutralForeground2,
  },
  
  tabList: {
    marginBottom: '32px',
  },
  
  settingsGrid: {
    display: 'grid',
    gap: '24px',
  },
  
  settingCard: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  
  settingHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  
  settingIcon: {
    fontSize: '20px',
    color: tokens.colorBrandForeground1,
  },
  
  settingTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  
  settingDescription: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '16px',
  },
  
  settingControl: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  
  settingLabel: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground1,
    fontWeight: '500',
  },
  
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px',
  },
  
  formRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  
  dangerCard: {
    backgroundColor: tokens.colorPaletteRedBackground1,
  },
  
  dangerButton: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorPaletteRedForeground1,
    border: `1px solid ${tokens.colorPaletteRedBorder1}`,
    
    '&:hover': {
      backgroundColor: tokens.colorPaletteRedBackground2,
    },
  },
  
  successMessage: {
    marginBottom: '16px',
  },
})

const SettingsPage: React.FC = () => {
  const styles = useStyles()
  const { entries } = useSelector((state: RootState) => state.mood)
  const { users, currentUser } = useSelector((state: RootState) => state.user)
  
  const [selectedTab, setSelectedTab] = useState<string>('general')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  
  // Settings state
  const [settings, setSettings] = useState({
    // General settings
    enableNotifications: true,
    enableSounds: false,
    enableMoodReminders: true,
    reminderFrequency: 'daily',
    
    // Privacy settings
    enableAnalytics: true,
    shareDataWithTeam: true,
    allowMoodHistory: true,
    
    // Theme settings
    theme: 'system',
    compactMode: false,
    
    // Data settings
    autoBackup: true,
    backupFrequency: 'weekly',
    retentionDays: 90,
  })

  const [personalInfo, setPersonalInfo] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    department: currentUser?.department || '',
    role: currentUser?.role || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
  })

  const showSuccess = () => {
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handlePersonalInfoChange = (key: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    // In a real app, this would save to backend
    localStorage.setItem('moodTrackingSettings', JSON.stringify(settings))
    localStorage.setItem('personalInfo', JSON.stringify(personalInfo))
    showSuccess()
  }

  const exportData = () => {
    const exportData = {
      settings,
      personalInfo,
      moodEntries: entries,
      users: users,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mood-tracking-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e: any) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e: any) => {
          try {
            const data = JSON.parse(e.target.result)
            if (data.settings) setSettings(data.settings)
            if (data.personalInfo) setPersonalInfo(data.personalInfo)
            showSuccess()
          } catch (error) {
            console.error('Failed to import data:', error)
            alert('Failed to import data. Please check the file format.')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storageService.clearAll()
      window.location.reload()
    }
  }

  const resetSettings = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings({
        enableNotifications: true,
        enableSounds: false,
        enableMoodReminders: true,
        reminderFrequency: 'daily',
        enableAnalytics: true,
        shareDataWithTeam: true,
        allowMoodHistory: true,
        theme: 'system',
        compactMode: false,
        autoBackup: true,
        backupFrequency: 'weekly',
        retentionDays: 90,
      })
      showSuccess()
    }
  }

  const renderGeneralSettings = () => (
    <div className={styles.settingsGrid}>
      <Card className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <AlertRegular className={styles.settingIcon} />
          <Text className={styles.settingTitle}>Notifications</Text>
        </div>
        <Text className={styles.settingDescription}>
          Configure how and when you receive notifications
        </Text>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Enable notifications</Text>
          <Switch 
            checked={settings.enableNotifications}
            onChange={(_, data) => handleSettingChange('enableNotifications', data.checked)}
          />
        </div>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Enable sounds</Text>
          <Switch 
            checked={settings.enableSounds}
            onChange={(_, data) => handleSettingChange('enableSounds', data.checked)}
          />
        </div>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Mood reminders</Text>
          <Switch 
            checked={settings.enableMoodReminders}
            onChange={(_, data) => handleSettingChange('enableMoodReminders', data.checked)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <Text className={styles.settingLabel}>Reminder frequency</Text>
          <Dropdown
            value={settings.reminderFrequency}
            onOptionSelect={(_, data) => handleSettingChange('reminderFrequency', data.optionValue)}
          >
            <Option value="never">Never</Option>
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="twice-daily">Twice daily</Option>
          </Dropdown>
        </div>
      </Card>

      <Card className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <PaintBrushRegular className={styles.settingIcon} />
          <Text className={styles.settingTitle}>Appearance</Text>
        </div>
        <Text className={styles.settingDescription}>
          Customize the look and feel of the application
        </Text>
        
        <div className={styles.formGroup}>
          <Text className={styles.settingLabel}>Theme</Text>
          <Dropdown
            value={settings.theme}
            onOptionSelect={(_, data) => handleSettingChange('theme', data.optionValue)}
          >
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
            <Option value="system">System</Option>
          </Dropdown>
        </div>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Compact mode</Text>
          <Switch 
            checked={settings.compactMode}
            onChange={(_, data) => handleSettingChange('compactMode', data.checked)}
          />
        </div>
      </Card>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className={styles.settingsGrid}>
      <Card className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <ShieldRegular className={styles.settingIcon} />
          <Text className={styles.settingTitle}>Privacy & Data</Text>
        </div>
        <Text className={styles.settingDescription}>
          Control how your data is used and shared
        </Text>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Enable analytics</Text>
          <Switch 
            checked={settings.enableAnalytics}
            onChange={(_, data) => handleSettingChange('enableAnalytics', data.checked)}
          />
        </div>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Share data with team</Text>
          <Switch 
            checked={settings.shareDataWithTeam}
            onChange={(_, data) => handleSettingChange('shareDataWithTeam', data.checked)}
          />
        </div>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Allow mood history</Text>
          <Switch 
            checked={settings.allowMoodHistory}
            onChange={(_, data) => handleSettingChange('allowMoodHistory', data.checked)}
          />
        </div>
      </Card>
    </div>
  )

  const renderDataSettings = () => (
    <div className={styles.settingsGrid}>
      <Card className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <DatabaseRegular className={styles.settingIcon} />
          <Text className={styles.settingTitle}>Data Management</Text>
        </div>
        <Text className={styles.settingDescription}>
          Manage your data backup and retention settings
        </Text>
        
        <div className={styles.settingControl}>
          <Text className={styles.settingLabel}>Auto backup</Text>
          <Switch 
            checked={settings.autoBackup}
            onChange={(_, data) => handleSettingChange('autoBackup', data.checked)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <Text className={styles.settingLabel}>Backup frequency</Text>
          <Dropdown
            value={settings.backupFrequency}
            onOptionSelect={(_, data) => handleSettingChange('backupFrequency', data.optionValue)}
          >
            <Option value="daily">Daily</Option>
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
          </Dropdown>
        </div>
        
        <div className={styles.formGroup}>
          <Text className={styles.settingLabel}>Data retention (days)</Text>
          <Input
            type="number"
            value={settings.retentionDays.toString()}
            onChange={(_, data) => handleSettingChange('retentionDays', parseInt(data.value) || 90)}
          />
        </div>
        
        <div className={styles.buttonGroup}>
          <Button 
            appearance="secondary" 
            icon={<ArrowDownloadRegular />}
            onClick={exportData}
          >
            Export Data
          </Button>
          <Button 
            appearance="secondary" 
            icon={<ArrowUploadRegular />}
            onClick={importData}
          >
            Import Data
          </Button>
        </div>
      </Card>

      <Card className={`${styles.settingCard} ${styles.dangerCard}`}>
        <div className={styles.settingHeader}>
          <DeleteRegular className={styles.settingIcon} />
          <Text className={styles.settingTitle}>Danger Zone</Text>
        </div>
        <Text className={styles.settingDescription}>
          Permanent actions that cannot be undone
        </Text>
        
        <div className={styles.buttonGroup}>
          <Button 
            appearance="secondary"
            onClick={resetSettings}
          >
            Reset Settings
          </Button>
          <Button 
            className={styles.dangerButton}
            icon={<DeleteRegular />}
            onClick={clearAllData}
          >
            Clear All Data
          </Button>
        </div>
      </Card>
    </div>
  )

  const renderProfileSettings = () => (
    <div className={styles.settingsGrid}>
      <Card className={styles.settingCard}>
        <div className={styles.settingHeader}>
          <SettingsRegular className={styles.settingIcon} />
          <Text className={styles.settingTitle}>Personal Information</Text>
        </div>
        <Text className={styles.settingDescription}>
          Update your personal details and profile information
        </Text>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <Text className={styles.settingLabel}>Full Name</Text>
            <Input
              value={personalInfo.name}
              onChange={(_, data) => handlePersonalInfoChange('name', data.value)}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <Text className={styles.settingLabel}>Email</Text>
            <Input
              type="email"
              value={personalInfo.email}
              onChange={(_, data) => handlePersonalInfoChange('email', data.value)}
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <Text className={styles.settingLabel}>Department</Text>
            <Input
              value={personalInfo.department}
              onChange={(_, data) => handlePersonalInfoChange('department', data.value)}
            />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <Text className={styles.settingLabel}>Role</Text>
            <Input
              value={personalInfo.role}
              onChange={(_, data) => handlePersonalInfoChange('role', data.value)}
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <Text className={styles.settingLabel}>Phone</Text>
          <Input
            value={personalInfo.phone}
            onChange={(_, data) => handlePersonalInfoChange('phone', data.value)}
          />
        </div>
        
        <div className={styles.formGroup}>
          <Text className={styles.settingLabel}>Bio</Text>
          <Textarea
            value={personalInfo.bio}
            onChange={(_, data) => handlePersonalInfoChange('bio', data.value)}
            placeholder="Tell us about yourself..."
            rows={3}
          />
        </div>
      </Card>
    </div>
  )

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Settings</Text>
        <Text className={styles.subtitle}>
          Customize your mood tracking experience
        </Text>
      </div>

      {showSuccessMessage && (
        <MessageBar intent="success" className={styles.successMessage}>
          <MessageBarBody>Settings saved successfully!</MessageBarBody>
        </MessageBar>
      )}

      <TabList
        className={styles.tabList}
        selectedValue={selectedTab}
        onTabSelect={(_, data) => setSelectedTab(data.value as string)}
      >
        <Tab value="general">General</Tab>
        <Tab value="profile">Profile</Tab>
        <Tab value="privacy">Privacy</Tab>
        <Tab value="data">Data</Tab>
      </TabList>

      {selectedTab === 'general' && renderGeneralSettings()}
      {selectedTab === 'profile' && renderProfileSettings()}
      {selectedTab === 'privacy' && renderPrivacySettings()}
      {selectedTab === 'data' && renderDataSettings()}

      <div className={styles.buttonGroup}>
        <Button 
          appearance="primary" 
          icon={<SaveRegular />}
          onClick={saveSettings}
        >
          Save Settings
        </Button>
      </div>
    </div>
  )
}

export default SettingsPage