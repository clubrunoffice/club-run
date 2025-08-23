'use client'

import { useState } from 'react'
import { P2PMissionCreator } from '../components/missions/P2PMissionCreator'
import { P2PMissionBoard } from '../components/missions/P2PMissionBoard'
import { useAuth } from '../contexts/AuthContext'

export function P2PMissions() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'board' | 'create'>('board')

  return (
    <div className="min-h-screen bg-tech-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-tech-black to-tech-gray border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🌐 Peer-to-Peer Missions
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Decentralized music servicing marketplace. Create missions, accept work, and get paid directly with crypto or traditional payment methods.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mt-8">
            <div className="bg-white/10 rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setActiveTab('board')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'board'
                    ? 'bg-tech-cyan text-tech-black shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🎵 Mission Board
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'create'
                    ? 'bg-tech-cyan text-tech-black shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                🚀 Create Mission
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Decentralization Benefits Banner */}
      <div className="bg-gradient-to-r from-tech-cyan/10 to-tech-blue/10 border-b border-tech-cyan/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🔷</div>
              <h3 className="font-semibold text-white mb-1">Crypto Payments</h3>
              <p className="text-sm text-white/70">MATIC, USDC, and more</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">💸</div>
              <h3 className="font-semibold text-white mb-1">Traditional Payments</h3>
              <p className="text-sm text-white/70">Cash App, Zelle, Venmo</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">⛓️</div>
              <h3 className="font-semibold text-white mb-1">Blockchain Escrow</h3>
              <p className="text-sm text-white/70">Secure payment protection</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-semibold text-white mb-1">Global Access</h3>
              <p className="text-sm text-white/70">Work with anyone, anywhere</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'board' ? (
          <P2PMissionBoard />
        ) : (
          <div>
            {!user ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔐</div>
                <h3 className="text-xl font-semibold text-white mb-2">Authentication Required</h3>
                <p className="text-white/70 mb-6">Please log in to create P2P missions</p>
                <button
                  onClick={() => setActiveTab('board')}
                  className="px-6 py-3 bg-tech-cyan text-tech-black font-semibold rounded-lg hover:bg-tech-cyan/90 transition-colors"
                >
                  Browse Missions Instead
                </button>
              </div>
            ) : (
              <P2PMissionCreator />
            )}
          </div>
        )}
      </div>

      {/* How It Works Section */}
      <div className="bg-white/5 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How P2P Missions Work</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-tech-cyan/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">1. Create Mission</h3>
              <p className="text-white/70">
                Curators create missions with detailed requirements, budget, and preferred payment method. 
                Mission details are stored on IPFS for decentralization.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-tech-cyan/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">2. Accept & Execute</h3>
              <p className="text-white/70">
                Runners browse the decentralized mission board and accept missions that match their skills. 
                Complete the work and submit proof to IPFS.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-tech-cyan/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">3. Get Paid</h3>
              <p className="text-white/70">
                Curators review proof and approve payment. Funds are released directly to runners via 
                their chosen payment method - crypto or traditional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="bg-gradient-to-r from-tech-black to-tech-gray">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Supported Payment Methods</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔷</span>
                <h3 className="text-lg font-semibold text-white">MATIC (Polygon)</h3>
              </div>
              <p className="text-white/70 text-sm mb-3">Direct peer-to-peer crypto payment on Polygon network</p>
              <div className="text-tech-cyan text-sm">~$0.01 gas fee</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💵</span>
                <h3 className="text-lg font-semibold text-white">USDC Stablecoin</h3>
              </div>
              <p className="text-white/70 text-sm mb-3">USD-pegged stable cryptocurrency for predictable payments</p>
              <div className="text-tech-cyan text-sm">~$0.02 gas fee</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💸</span>
                <h3 className="text-lg font-semibold text-white">Cash App</h3>
              </div>
              <p className="text-white/70 text-sm mb-3">Instant mobile payment with $cashtag or email</p>
              <div className="text-tech-cyan text-sm">Free</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏦</span>
                <h3 className="text-lg font-semibold text-white">Zelle</h3>
              </div>
              <p className="text-white/70 text-sm mb-3">Bank-to-bank transfer for secure payments</p>
              <div className="text-tech-cyan text-sm">Free</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">💙</span>
                <h3 className="text-lg font-semibold text-white">Venmo</h3>
              </div>
              <p className="text-white/70 text-sm mb-3">Social payment app with @username transfers</p>
              <div className="text-tech-cyan text-sm">Free for bank transfers</div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🔵</span>
                <h3 className="text-lg font-semibold text-white">PayPal</h3>
              </div>
              <p className="text-white/70 text-sm mb-3">Global digital payments with email transfers</p>
              <div className="text-tech-cyan text-sm">2.9% + $0.30 (Friends & Family free)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
