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
    console.log("[v0] ThemeProvider initializing...")
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme && ["light", "dark", "blue"].includes(savedTheme)) {
      console.log("[v0] Found saved theme:", savedTheme)
      setTheme(savedTheme)
    } else {
      console.log("[v0] No saved theme, using default: dark")
    }
    setMounted(true)
    console.log("[v0] ThemeProvider mounted")
  }, [])

  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    html.classList.remove("light", "dark", "blue")
    html.classList.add(theme)
    localStorage.setItem("theme", theme)

    console.log("[v0] Theme applied:", theme)
    console.log("[v0] HTML classes:", html.className)

    const computedStyle = getComputedStyle(document.documentElement)
    const bgColor = computedStyle.getPropertyValue("--background").trim()
    const fgColor = computedStyle.getPropertyValue("--foreground").trim()
    console.log("[v0] CSS Variables - Background:", bgColor, "Foreground:", fgColor)

    const bodyStyle = getComputedStyle(document.body)
    console.log("[v0] Body background-color:", bodyStyle.backgroundColor)
  }, [theme, mounted])

  const toggleTheme = () => {
    const themeOrder: Theme[] = ["light", "dark", "blue"]
    const currentIndex = themeOrder.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    const newTheme = themeOrder[nextIndex]
    console.log("[v0] Toggling theme from", theme, "to", newTheme)
    setTheme(newTheme)
  }

  const contextValue = { theme, toggleTheme }
  console.log("[v0] ThemeProvider rendering with context:", contextValue, "mounted:", mounted)

  return (
    <ThemeContext.Provider value={contextValue}>
      {mounted ? children : <div style={{ visibility: "hidden" }}>{children}</div>}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  console.log("[v0] useTheme called, context:", context)
  if (!context) {
    console.error("[v0] useTheme called outside of ThemeProvider!")
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
