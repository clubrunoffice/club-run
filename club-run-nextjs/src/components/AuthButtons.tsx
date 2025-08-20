"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/Button"

export function AuthButtons() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex gap-4 justify-center">
        <Button onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-4 justify-center">
      <Button onClick={() => signIn()}>
        Sign In
      </Button>
      <Button variant="outline" onClick={() => signIn()}>
        Sign Up
      </Button>
    </div>
  )
} 