'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface PaymentOption {
  id: string
  name: string
  type: 'crypto_native' | 'crypto_token' | 'fiat'
  icon: string
  description: string
  fees: string
}

interface MissionData {
  title: string
  description: string
  budget: number
  deadline: string
  venueAddress: string
  eventType: string
  requirements: string[]
  teamId?: string
  openMarket: boolean
}

interface Team {
  id: string
  name: string
  description: string
  _count: {
    members: number
  }
}

export function P2PMissionCreator() {
  const { user } = useAuth()
  
  const [missionData, setMissionData] = useState<MissionData>({
    title: '',
    description: '',
    budget: 0,
    deadline: '',
    venueAddress: '',
    eventType: '',
    requirements: [],
    openMarket: true
  })
  
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [missionType, setMissionType] = useState<'open' | 'team'>('open')

  const paymentOptions: PaymentOption[] = [
    {
      id: 'matic',
      name: 'MATIC (Polygon)',
      type: 'crypto_native',
      icon: '🔷',
      description: 'Direct peer-to-peer crypto payment',
      fees: '~$0.01 gas fee'
    },
    {
      id: 'usdc',
      name: 'USDC Stablecoin',
      type: 'crypto_token',
      icon: '💵',
      description: 'USD-pegged stable cryptocurrency',
      fees: '~$0.02 gas fee'
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      type: 'fiat',
      icon: '💸',
      description: 'Instant mobile payment',
      fees: 'Free'
    },
    {
      id: 'zelle',
      name: 'Zelle',
      type: 'fiat',
      icon: '🏦',
      description: 'Bank-to-bank transfer',
      fees: 'Free'
    },
    {
      id: 'venmo',
      name: 'Venmo',
      type: 'fiat',
      icon: '💙',
      description: 'Social payment app',
      fees: 'Free for bank transfers'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'fiat',
      icon: '🔵',
      description: 'Global digital payments',
      fees: '2.9% + $0.30 (Friends & Family free)'
    }
  ]

  const eventTypes = [
    'DJ Performance',
    'Live Music',
    'Corporate Event',
    'Wedding Reception',
    'Birthday Party',
    'Club Night',
    'Festival',
    'Private Party',
    'Bar/Lounge',
    'Restaurant',
    'Other'
  ]

  // Load teams if user is a curator
  useEffect(() => {
    if (user?.role === 'CURATOR') {
      loadTeams()
    }
  }, [user])

  const loadTeams = async () => {
    try {
      const response = await fetch('/api/teams', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await response.json()
      if (response.ok) {
        setTeams(data.teams)
      }
    } catch (err) {
      console.error('Failed to load teams:', err)
    }
  }

  const handleCreateMission = async () => {
    if (!selectedPayment || !user) {
      setError('Please select a payment method and ensure you are logged in')
      return
    }

    if (!missionData.title || !missionData.budget || !missionData.deadline) {
      setError('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/p2p-missions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...missionData,
          paymentMethod: selectedPayment.id,
          teamId: missionType === 'team' ? missionData.teamId : null,
          openMarket: missionType === 'open'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create mission')
      }

      setSuccess('P2P mission created successfully!')
      
      // Reset form
      setMissionData({
        title: '',
        description: '',
        budget: 0,
        deadline: '',
        venueAddress: '',
        eventType: '',
        requirements: [],
        openMarket: true
      })
      setSelectedPayment(null)
      setMissionType('open')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mission')
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRequirement = () => {
    setMissionData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }))
  }

  const updateRequirement = (index: number, value: string) => {
    setMissionData(prev => ({
      ...prev,
      requirements: prev.requirements.map((req, i) => i === index ? value : req)
    }))
  }

  const removeRequirement = (index: number) => {
    setMissionData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Create P2P Mission</h2>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <p className="text-green-400">{success}</p>
        </div>
      )}
      
      {/* Mission Type Selection (for Curators) */}
      {user?.role === 'CURATOR' && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Mission Type</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              onClick={() => setMissionType('open')}
              className={`p-4 cursor-pointer transition-all duration-300 rounded-lg border ${
                missionType === 'open'
                  ? 'ring-2 ring-tech-cyan bg-tech-cyan/10 border-tech-cyan/30' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🌐</span>
                <div>
                  <h4 className="font-semibold text-white">Open Marketplace</h4>
                  <p className="text-sm text-tech-cyan">Available to all runners</p>
                </div>
              </div>
              <p className="text-sm text-white/70">Anyone can see and accept this mission</p>
            </div>

            <div
              onClick={() => setMissionType('team')}
              className={`p-4 cursor-pointer transition-all duration-300 rounded-lg border ${
                missionType === 'team'
                  ? 'ring-2 ring-tech-cyan bg-tech-cyan/10 border-tech-cyan/30' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👥</span>
                <div>
                  <h4 className="font-semibold text-white">Team Only</h4>
                  <p className="text-sm text-tech-cyan">Restricted to your team</p>
                </div>
              </div>
              <p className="text-sm text-white/70">Only your team members can see and accept</p>
            </div>
          </div>

          {/* Team Selection (if team mission) */}
          {missionType === 'team' && (
            <div className="mt-4">
              <label className="block text-white font-medium mb-2">Select Team *</label>
              <select
                value={missionData.teamId || ''}
                onChange={(e) => setMissionData({...missionData, teamId: e.target.value})}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
              >
                <option value="">Select a team</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team._count.members} members)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Mission Details Form */}
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-white font-medium mb-2">Mission Title *</label>
          <input
            type="text"
            value={missionData.title}
            onChange={(e) => setMissionData({...missionData, title: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
            placeholder="e.g., DJ for Corporate Event"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Description</label>
          <textarea
            value={missionData.description}
            onChange={(e) => setMissionData({...missionData, description: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
            rows={4}
            placeholder="Describe the mission requirements, venue details, and expectations..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Budget ($) *</label>
            <input
              type="number"
              value={missionData.budget}
              onChange={(e) => setMissionData({...missionData, budget: parseFloat(e.target.value) || 0})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
              placeholder="500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Deadline *</label>
            <input
              type="datetime-local"
              value={missionData.deadline}
              onChange={(e) => setMissionData({...missionData, deadline: e.target.value})}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Venue Address</label>
          <input
            type="text"
            value={missionData.venueAddress}
            onChange={(e) => setMissionData({...missionData, venueAddress: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
            placeholder="123 Club Street, Atlanta, GA"
          />
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Event Type</label>
          <select
            value={missionData.eventType}
            onChange={(e) => setMissionData({...missionData, eventType: e.target.value})}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
          >
            <option value="">Select event type</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white font-medium mb-2">Requirements</label>
          <div className="space-y-2">
            {missionData.requirements.map((req, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-tech-cyan focus:border-transparent"
                  placeholder="e.g., Must have own equipment"
                />
                <button
                  onClick={() => removeRequirement(index)}
                  className="px-4 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addRequirement}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              + Add Requirement
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Choose Payment Method *</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {paymentOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => setSelectedPayment(option)}
              className={`p-4 cursor-pointer transition-all duration-300 rounded-lg border ${
                selectedPayment?.id === option.id 
                  ? 'ring-2 ring-tech-cyan bg-tech-cyan/10 border-tech-cyan/30' 
                  : 'bg-white/5 border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{option.name}</h4>
                  <p className="text-sm text-tech-cyan">{option.fees}</p>
                </div>
              </div>
              <p className="text-sm text-white/70">{option.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decentralization Benefits */}
      <div className="bg-white/5 rounded-lg p-6 mb-6 border border-white/10">
        <h4 className="font-semibold text-white mb-3">🌐 Peer-to-Peer Benefits</h4>
        <ul className="space-y-2 text-sm text-white/70">
          <li>✅ No platform fees - direct curator to runner payment</li>
          <li>✅ Blockchain escrow ensures payment security</li>
          <li>✅ Choose your preferred payment method</li>
          <li>✅ Immutable proof of mission completion</li>
          <li>✅ Global accessibility - work with anyone, anywhere</li>
        </ul>
      </div>

      {/* Create Mission Button */}
      <button
        onClick={handleCreateMission}
        disabled={!selectedPayment || !missionData.title || !missionData.budget || isSubmitting}
        className="w-full px-6 py-4 bg-gradient-to-r from-tech-cyan to-tech-blue text-tech-black font-semibold rounded-lg hover:from-tech-cyan/90 hover:to-tech-blue/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? 'Creating Mission...' : '🚀 Create Decentralized Mission'}
      </button>
    </div>
  )
}
