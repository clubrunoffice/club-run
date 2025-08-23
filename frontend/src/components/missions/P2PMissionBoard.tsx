'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface P2PMission {
  id: string
  curator: {
    id: string
    name: string
    avatar: string
    reputation: number
  }
  runner?: {
    id: string
    name: string
    avatar: string
    reputation: number
  }
  budget: number
  paymentMethod: string
  status: string
  deadline: Date
  title: string
  description: string
  venueAddress: string
  eventType: string
  ipfsHash: string
  createdAt: Date
  details?: any
  team?: {
    id: string
    name: string
    description: string
  }
  openMarket: boolean
}

interface MissionFilters {
  paymentType: string
  status: string
  minBudget: string
  maxBudget: string
}

export function P2PMissionBoard() {
  const { user } = useAuth()
  const [missions, setMissions] = useState<P2PMission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<MissionFilters>({
    paymentType: 'all',
    status: 'all',
    minBudget: '',
    maxBudget: ''
  })
  const [showTeamOnly, setShowTeamOnly] = useState(false)

  const getPaymentIcon = (paymentType: string) => {
    const icons: { [key: string]: string } = {
      matic: '🔷',
      usdc: '💵',
      cashapp: '💸',
      zelle: '🏦',
      venmo: '💙',
      paypal: '🔵'
    }
    return icons[paymentType] || '💰'
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

  const loadMissions = async () => {
    setLoading(true)
    setError('')

    try {
      const queryParams = new URLSearchParams()
      if (filters.paymentType !== 'all') queryParams.append('paymentType', filters.paymentType)
      if (filters.status !== 'all') queryParams.append('status', filters.status)
      if (filters.minBudget) queryParams.append('minBudget', filters.minBudget)
      if (filters.maxBudget) queryParams.append('maxBudget', filters.maxBudget)
      if (showTeamOnly) queryParams.append('teamOnly', 'true')

      const response = await fetch(`/api/p2p-missions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch missions')
      }

      setMissions(data.missions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load missions')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptMission = async (missionId: string) => {
    try {
      const response = await fetch(`/api/p2p-missions/${missionId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept mission')
      }

      // Reload missions to update status
      await loadMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept mission')
    }
  }

  useEffect(() => {
    loadMissions()
  }, [filters, showTeamOnly])

  const filteredMissions = missions.filter(mission => {
    if (filters.paymentType !== 'all' && mission.paymentMethod !== filters.paymentType) return false
    if (filters.status !== 'all' && mission.status !== filters.status) return false
    if (filters.minBudget && mission.budget < parseFloat(filters.minBudget)) return false
    if (filters.maxBudget && mission.budget > parseFloat(filters.maxBudget)) return false
    return true
  })

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tech-cyan"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">P2P Mission Board</h2>
        
        {/* Decentralized Status Indicator */}
        <div className="flex items-center gap-2 text-sm text-tech-green">
          <div className="w-2 h-2 bg-tech-green rounded-full animate-pulse"></div>
          Decentralized Network Active
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Filter Options */}
      <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
        
        {/* Team Filter Toggle */}
        <div className="mb-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={showTeamOnly}
              onChange={(e) => setShowTeamOnly(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-tech-cyan focus:ring-tech-cyan"
            />
            <span>Show team missions only</span>
          </label>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-white text-sm mb-2">Payment Type</label>
            <select
              value={filters.paymentType}
              onChange={(e) => setFilters({...filters, paymentType: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan"
            >
              <option value="all">All Payments</option>
              <option value="matic">🔷 Crypto (MATIC)</option>
              <option value="usdc">💵 Crypto (USDC)</option>
              <option value="cashapp">💸 Cash App</option>
              <option value="zelle">🏦 Zelle</option>
              <option value="venmo">💙 Venmo</option>
              <option value="paypal">🔵 PayPal</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan"
            >
              <option value="all">All Status</option>
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="DISPUTED">Disputed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Min Budget</label>
            <input
              type="number"
              value={filters.minBudget}
              onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Max Budget</label>
            <input
              type="number"
              value={filters.maxBudget}
              onChange={(e) => setFilters({...filters, maxBudget: e.target.value})}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan"
              placeholder="10000"
            />
          </div>
        </div>
      </div>

      {/* Mission Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => (
          <div key={mission.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:shadow-lg hover:shadow-tech-cyan/20 transition-all duration-300">
            {/* Mission Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white truncate">{mission.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xl">{getPaymentIcon(mission.paymentMethod)}</span>
                <span className="bg-tech-green text-tech-black px-2 py-1 rounded-full text-sm font-medium">
                  ${mission.budget}
                </span>
              </div>
            </div>

            {/* Team Badge */}
            {mission.team && (
              <div className="mb-4">
                <span className="inline-block px-2 py-1 bg-tech-cyan/20 text-tech-cyan text-xs font-medium rounded-full border border-tech-cyan/30">
                  👥 {mission.team.name}
                </span>
              </div>
            )}

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(mission.status)}`}>
                {mission.status.replace('_', ' ')}
              </span>
            </div>

            {/* Mission Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>📍</span>
                <span className="truncate">{mission.venueAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>🎵</span>
                <span>{mission.eventType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>⏰</span>
                <span>{new Date(mission.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>👤</span>
                <span>{mission.curator.name}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-sm text-white/70 line-clamp-3">
                {mission.description || 'No description provided'}
              </p>
            </div>

            {/* P2P Features */}
            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <div className="text-xs text-tech-cyan font-medium mb-1">Peer-to-Peer Mission</div>
              <div className="text-xs text-white/70">
                • Direct payment to you<br/>
                • Blockchain escrow protection<br/>
                • No platform fees
              </div>
            </div>

            {/* Action Button */}
            {mission.status === 'OPEN' && user && user.id !== mission.curator.id && (
              <button
                onClick={() => handleAcceptMission(mission.id)}
                className="w-full px-4 py-3 bg-gradient-to-r from-tech-cyan to-tech-blue text-tech-black font-semibold rounded-lg hover:from-tech-cyan/90 hover:to-tech-blue/90 transition-all duration-300"
              >
                Accept P2P Mission
              </button>
            )}

            {mission.status === 'OPEN' && (!user || user.id === mission.curator.id) && (
              <div className="w-full px-4 py-3 bg-gray-500/20 text-gray-400 rounded-lg text-center">
                {!user ? 'Login to accept' : 'Your mission'}
              </div>
            )}

            {mission.status !== 'OPEN' && (
              <div className="w-full px-4 py-3 bg-gray-500/20 text-gray-400 rounded-lg text-center">
                {mission.status.replace('_', ' ')}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMissions.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-white mb-2">No missions found</h3>
          <p className="text-white/70">Try adjusting your filters or check back later for new missions</p>
        </div>
      )}
    </div>
  )
}
