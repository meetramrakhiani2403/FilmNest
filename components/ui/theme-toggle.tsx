"use client"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const handleThemeToggle = () => {
    console.log("[v0] Theme toggle clicked, current theme:", theme)
    toggleTheme()
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />
      case "blue":
        return <Palette className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
      {getThemeIcon()}
      <span className="sr-only">Toggle theme (current: {theme})</span>
    </Button>
  )
}
