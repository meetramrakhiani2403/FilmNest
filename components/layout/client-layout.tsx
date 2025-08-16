"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"

interface User {
  id: string
  name: string
  email: string
}

interface ClientLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
}

export function ClientLayout({ children, showNavbar = true }: ClientLayoutProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      }
    }

    loadUser()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {showNavbar && <Navbar user={user} />}
      {children}
    </div>
  )
}
