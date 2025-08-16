"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "blue"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme && ["light", "dark", "blue"].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      
    }
    setMounted(true)
    
  }, [])

  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    html.classList.remove("light", "dark", "blue")
    html.classList.add(theme)
    localStorage.setItem("theme", theme)


    const computedStyle = getComputedStyle(document.documentElement)
    const bgColor = computedStyle.getPropertyValue("--background").trim()
    const fgColor = computedStyle.getPropertyValue("--foreground").trim()

    const bodyStyle = getComputedStyle(document.body)
  }, [theme, mounted])

  const toggleTheme = () => {
    const themeOrder: Theme[] = ["light", "dark", "blue"]
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const newTheme = themeOrder[nextIndex]
    setTheme(newTheme)
  }

  const contextValue = { theme, toggleTheme }

  return (
    <ThemeContext.Provider value={contextValue}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
