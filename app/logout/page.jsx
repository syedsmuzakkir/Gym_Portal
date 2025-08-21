"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { clearCurrentUser } from "@/lib/auth"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear user session
    clearCurrentUser()

    // Redirect to login after a brief delay
    const timer = setTimeout(() => {
      router.push("/login")
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}
