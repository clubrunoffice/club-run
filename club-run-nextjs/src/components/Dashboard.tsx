"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"
import { signOut } from "next-auth/react"

export function Dashboard() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Club Run Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                Welcome, {session?.user?.name || session?.user?.email}
              </span>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Activities Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Activities</h2>
            <p className="text-gray-600 mb-4">
              Create and join fitness activities with other members.
            </p>
            <Button className="w-full">
              View Activities
            </Button>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <p className="text-gray-600 mb-4">
              Manage your profile and preferences.
            </p>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <p className="text-gray-600 mb-4">
              Stay updated with activity notifications.
            </p>
            <Button variant="outline" className="w-full">
              View Notifications
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
} 