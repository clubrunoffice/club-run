'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface Team {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  members: TeamMember[]
  missions: TeamMission[]
  _count: {
    members: number
    missions: number
  }
}

interface TeamMember {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  missionsCompleted: number
  lastLoginAt: string
}

interface TeamMission {
  id: string
  title: string
  status: string
  budget: number
  createdAt: string
}

interface TeamAnalytics {
  memberCount: number
  missionStats: any[]
  totalBudget: number
  recentActivity: any[]
}

export function CuratorDashboard() {
  const { user } = useAuth()
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [analytics, setAnalytics] = useState<TeamAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'teams' | 'missions' | 'analytics'>('overview')

  // Form states
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [newTeamData, setNewTeamData] = useState({ name: '', description: '' })
  const [showInviteMember, setShowInviteMember] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/teams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setTeams(data.teams)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const loadTeamAnalytics = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setAnalytics(data.analytics)
    } catch (err) {
      console.error('Failed to load analytics:', err)
    }
  }

  const handleCreateTeam = async () => {
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTeamData)
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setShowCreateTeam(false)
      setNewTeamData({ name: '', description: '' })
      await loadTeams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team')
    }
  }

  const handleInviteMember = async (teamId: string) => {
    try {
      const response = await fetch(`/api/teams/${teamId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ runnerEmail: inviteEmail })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setShowInviteMember(false)
      setInviteEmail('')
      await loadTeams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite member')
    }
  }

  const handleRemoveMember = async (teamId: string, runnerId: string) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) return

    try {
      const response = await fetch(`/api/teams/${teamId}/members/${runnerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      await loadTeams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      OPEN: 'bg-green-500/20 text-green-400 border-green-500/30',
      ASSIGNED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      IN_PROGRESS: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      COMPLETED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      DISPUTED: 'bg-red-500/20 text-red-400 border-red-500/30',
      CANCELLED: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-cyan"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">🏆 Curator Dashboard</h1>
        <p className="text-white/70">Manage your teams and appointed missions</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'overview'
              ? 'bg-tech-cyan text-tech-black shadow-lg'
              : 'text-white hover:bg-white/10'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'teams'
              ? 'bg-tech-cyan text-tech-black shadow-lg'
              : 'text-white hover:bg-white/10'
          }`}
        >
          👥 Teams
        </button>
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'missions'
              ? 'bg-tech-cyan text-tech-black shadow-lg'
              : 'text-white hover:bg-white/10'
          }`}
        >
          🎯 Missions
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
            activeTab === 'analytics'
              ? 'bg-tech-cyan text-tech-black shadow-lg'
              : 'text-white hover:bg-white/10'
          }`}
        >
          📈 Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Teams</h3>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-tech-cyan">{teams.length}</p>
            <p className="text-sm text-white/70 mt-2">Active teams you manage</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Total Members</h3>
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-3xl font-bold text-tech-cyan">
              {teams.reduce((sum, team) => sum + team._count.members, 0)}
            </p>
            <p className="text-sm text-white/70 mt-2">Runners across all teams</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Missions</h3>
              <span className="text-2xl">🎯</span>
            </div>
            <p className="text-3xl font-bold text-tech-cyan">
              {teams.reduce((sum, team) => sum + team._count.missions, 0)}
            </p>
            <p className="text-sm text-white/70 mt-2">Ongoing team missions</p>
          </div>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Team Management</h2>
            <button
              onClick={() => setShowCreateTeam(true)}
              className="px-4 py-2 bg-tech-cyan text-tech-black font-semibold rounded-lg hover:bg-tech-cyan/90 transition-colors"
            >
              + Create Team
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    team.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {team.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-white/70 text-sm mb-4">{team.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-white/70">
                    <span className="font-medium">{team._count.members}</span> members
                  </div>
                  <div className="text-sm text-white/70">
                    <span className="font-medium">{team._count.missions}</span> missions
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedTeam(team)
                      setShowInviteMember(true)
                    }}
                    className="w-full px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm"
                  >
                    + Invite Member
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTeam(team)
                      loadTeamAnalytics(team.id)
                      setActiveTab('analytics')
                    }}
                    className="w-full px-3 py-2 bg-tech-cyan/20 text-tech-cyan rounded-lg hover:bg-tech-cyan/30 transition-colors text-sm"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missions Tab */}
      {activeTab === 'missions' && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Team Missions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.flatMap(team => 
              team.missions.map(mission => (
                <div key={mission.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{mission.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(mission.status)}`}>
                      {mission.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-tech-cyan font-semibold">${mission.budget}</p>
                    <p className="text-white/70 text-sm">{team.name}</p>
                  </div>

                  <div className="text-xs text-white/50">
                    Created: {new Date(mission.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && selectedTeam && analytics && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">{selectedTeam.name} Analytics</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Team Members</h3>
              <p className="text-3xl font-bold text-tech-cyan">{analytics.memberCount}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Total Budget</h3>
              <p className="text-3xl font-bold text-tech-cyan">${analytics.totalBudget}</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Completed Missions</h3>
              <p className="text-3xl font-bold text-tech-cyan">
                {analytics.missionStats.find(stat => stat.status === 'COMPLETED')?._count.status || 0}
              </p>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {analytics.recentActivity.map((mission, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{mission.title}</p>
                    <p className="text-white/70 text-sm">
                      {mission.runner?.name || 'Unassigned'} • ${mission.budget}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(mission.status)}`}>
                    {mission.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Team Modal */}
      {showCreateTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-tech-black rounded-lg p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Create New Team</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm mb-2">Team Name</label>
                <input
                  type="text"
                  value={newTeamData.name}
                  onChange={(e) => setNewTeamData({...newTeamData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan"
                  placeholder="e.g., ATL Residency DJs"
                />
              </div>
              
              <div>
                <label className="block text-white text-sm mb-2">Description</label>
                <textarea
                  value={newTeamData.description}
                  onChange={(e) => setNewTeamData({...newTeamData, description: e.target.value})}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan"
                  rows={3}
                  placeholder="Team description..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateTeam(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTeam}
                disabled={!newTeamData.name}
                className="flex-1 px-4 py-2 bg-tech-cyan text-tech-black font-semibold rounded-lg hover:bg-tech-cyan/90 transition-colors disabled:opacity-50"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteMember && selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-tech-black rounded-lg p-6 w-full max-w-md border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Invite to {selectedTeam.name}</h3>
            
            <div className="mb-4">
              <label className="block text-white text-sm mb-2">Runner Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan"
                placeholder="runner@example.com"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowInviteMember(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleInviteMember(selectedTeam.id)}
                disabled={!inviteEmail}
                className="flex-1 px-4 py-2 bg-tech-cyan text-tech-black font-semibold rounded-lg hover:bg-tech-cyan/90 transition-colors disabled:opacity-50"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
