import React, { useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
  makeStyles,
  Text,
  Card,
  Avatar,
  Badge,
  Button,
  Dropdown,
  Option,
  tokens,
  SearchBox,
} from '@fluentui/react-components'
import {
  PersonRegular,
  MailRegular,
  CalendarRegular,
  LocationRegular,
  PhoneRegular,
  EditRegular,
} from '@fluentui/react-icons'
import { format } from 'date-fns'
import { RootState } from '../store/store'
import { MoodType } from '../types'

const useStyles = makeStyles({
  container: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground2,
    height: '100%',
    overflowY: 'auto',
  },
  
  header: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
  },
  
  searchSection: {
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  
  searchBox: {
    minWidth: '300px',
  },
  
  filterDropdown: {
    minWidth: '150px',
  },
  
  membersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  
  memberCard: {
    padding: '24px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  
  memberHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
  },
  
  memberInfo: {
    flex: 1,
  },
  
  memberName: {
    fontSize: '18px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '4px',
  },
  
  memberRole: {
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
    marginBottom: '8px',
  },
  
  statusBadge: {
    marginLeft: 'auto',
  },
  
  memberDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: tokens.colorNeutralForeground2,
  },
  
  detailIcon: {
    fontSize: '16px',
  },
  
  moodHistory: {
    marginTop: '16px',
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '6px',
  },
  
  moodHistoryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: tokens.colorNeutralForeground1,
    marginBottom: '12px',
  },
  
  moodHistoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  
  moodHistoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
  
  moodBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  editButton: {
    marginTop: '16px',
  },
  
  statsSection: {
    marginBottom: '32px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  
  statCard: {
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    textAlign: 'center',
  },
  
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: tokens.colorBrandForeground1,
    marginBottom: '4px',
  },
  
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground2,
  },
})

const TeamMembersPage: React.FC = () => {
  const styles = useStyles()
  const { users } = useSelector((state: RootState) => state.user)
  const { entries } = useSelector((state: RootState) => state.mood)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const moodColors: Record<MoodType, string> = {
    happy: '#00BCF2',
    excited: '#FF8C00', 
    content: '#237B4B',
    motivated: '#6264A7',
    neutral: '#666666',
    tired: '#8B5A9A',
    stressed: '#D83B01',
    frustrated: '#E74856',
    anxious: '#CA5010',
    sad: '#005A6B',
  }

  const getStatusBadgeAppearance = (status: string) => {
    switch (status) {
      case 'online': return 'success'
      case 'busy': return 'important'
      case 'away': return 'warning'
      case 'offline': return 'subtle'
      default: return 'subtle'
    }
  }

  const getUserMoodHistory = (userId: string) => {
    return entries
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.department?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      
      const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
      
      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [users, searchQuery, selectedDepartment, selectedStatus])

  const departments = useMemo(() => {
    const depts = Array.from(new Set(users.map(user => user.department)))
    return ['all', ...depts]
  }, [users])

  const statuses = ['all', 'online', 'busy', 'away', 'offline']

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const totalMembers = users.length
    const onlineMembers = users.filter(user => user.status === 'online').length
    const departmentCount = new Set(users.map(user => user.department)).size
    const activeMembers = new Set(entries.map(entry => entry.userId)).size

    return {
      totalMembers,
      onlineMembers,
      departmentCount,
      activeMembers
    }
  }, [users, entries])

  const handleEditUser = (userId: string) => {
    // This would open an edit modal in a real app
    console.log('Edit user:', userId)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text className={styles.title}>Team Members</Text>
        <Button 
          appearance="primary" 
          icon={<PersonRegular />}
        >
          Add Member
        </Button>
      </div>

      {/* Team Statistics */}
      <div className={styles.statsSection}>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{teamStats.totalMembers}</Text>
          <Text className={styles.statLabel}>Total Members</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{teamStats.onlineMembers}</Text>
          <Text className={styles.statLabel}>Online Now</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{teamStats.departmentCount}</Text>
          <Text className={styles.statLabel}>Departments</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{teamStats.activeMembers}</Text>
          <Text className={styles.statLabel}>Active This Week</Text>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className={styles.searchSection}>
        <SearchBox
          className={styles.searchBox}
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
        />
        
        <Dropdown
          className={styles.filterDropdown}
          placeholder="Department"
          value={selectedDepartment}
          onOptionSelect={(_, data) => setSelectedDepartment(data.optionValue as string)}
        >
          {departments.map(dept => (
            <Option key={dept} value={dept} text={dept === 'all' ? 'All Departments' : dept || ''}>
              {dept === 'all' ? 'All Departments' : dept}
            </Option>
          ))}
        </Dropdown>

        <Dropdown
          className={styles.filterDropdown}
          placeholder="Status"
          value={selectedStatus}
          onOptionSelect={(_, data) => setSelectedStatus(data.optionValue as string)}
        >
          {statuses.map(status => (
            <Option key={status} value={status} text={status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}>
              {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Option>
          ))}
        </Dropdown>
      </div>

      {/* Members Grid */}
      <div className={styles.membersGrid}>
        {filteredUsers.map(user => {
          const moodHistory = getUserMoodHistory(user.id)
          
          return (
            <Card key={user.id} className={styles.memberCard}>
              <div className={styles.memberHeader}>
                <Avatar
                  name={user.name}
                  image={{ src: user.avatar }}
                  size={64}
                />
                <div className={styles.memberInfo}>
                  <Text className={styles.memberName}>{user.name}</Text>
                  <Text className={styles.memberRole}>{user.role}</Text>
                  <Badge 
                    className={styles.statusBadge}
                    appearance={getStatusBadgeAppearance(user.status) as any}
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className={styles.memberDetails}>
                <div className={styles.detailItem}>
                  <MailRegular className={styles.detailIcon} />
                  <Text>{user.email}</Text>
                </div>
                <div className={styles.detailItem}>
                  <LocationRegular className={styles.detailIcon} />
                  <Text>{user.department}</Text>
                </div>
                <div className={styles.detailItem}>
                  <CalendarRegular className={styles.detailIcon} />
                  <Text>Joined {format(new Date(user.joinDate), 'MMM yyyy')}</Text>
                </div>
                <div className={styles.detailItem}>
                  <PhoneRegular className={styles.detailIcon} />
                  <Text>{user.phone || 'Not provided'}</Text>
                </div>
              </div>

              {moodHistory.length > 0 && (
                <div className={styles.moodHistory}>
                  <Text className={styles.moodHistoryTitle}>Recent Mood Activity</Text>
                  <div className={styles.moodHistoryList}>
                    {moodHistory.map((entry, index) => (
                      <div key={index} className={styles.moodHistoryItem}>
                        <Text>{format(new Date(entry.timestamp), 'MMM dd, HH:mm')}</Text>
                        <span 
                          className={styles.moodBadge}
                          style={{ 
                            backgroundColor: moodColors[entry.mood],
                            color: 'white'
                          }}
                        >
                          {entry.mood}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                className={styles.editButton}
                appearance="subtle"
                icon={<EditRegular />}
                onClick={() => handleEditUser(user.id)}
              >
                Edit Profile
              </Button>
            </Card>
          )
        })}
      </div>

      {filteredUsers.length === 0 && (
        <Card style={{ padding: '48px', textAlign: 'center' }}>
          <Text>No team members found matching your search criteria.</Text>
        </Card>
      )}
    </div>
  )
}

export default TeamMembersPage