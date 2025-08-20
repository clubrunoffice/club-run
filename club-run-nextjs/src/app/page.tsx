import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Dashboard } from "@/components/Dashboard"
import { AuthButtons } from "@/components/AuthButtons"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    return <Dashboard />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to Club Run
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our fitness community and connect with like-minded individuals. 
            Create activities, join events, and stay motivated together.
          </p>
          <AuthButtons />
        </div>
      </div>
    </main>
  )
}
