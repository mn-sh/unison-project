"use client"

import { useState, useEffect, useCallback } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "default" | "dark"

interface ThemeSwitcherProps {
  className?: string
}

const ThemeSwitcher = ({ className = "" }: ThemeSwitcherProps) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("default")

  // Load theme from localStorage on component mount
  useEffect(() => {
    // Check for system preference first
    const savedTheme = localStorage.getItem("color-theme") as Theme | null
    if (savedTheme && (savedTheme === "default" || savedTheme === "dark")) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    }
  }, [])

  // Apply theme to document - optimized to avoid redundant operations
  const applyTheme = useCallback((theme: Theme) => {
    document.documentElement.classList.remove("theme-default", "theme-dark")
    document.documentElement.classList.add(`theme-${theme}`)
    localStorage.setItem("color-theme", theme)
  }, [])

  // Handle theme toggle with memoized callback
  const toggleTheme = useCallback(() => {
    const newTheme = currentTheme === "default" ? "dark" : "default"
    setCurrentTheme(newTheme)
    applyTheme(newTheme)
  }, [currentTheme, applyTheme])

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleTheme}
        className="theme-toggle-button flex items-center justify-center w-8 h-8 transition-all duration-300 text-white"
        aria-label={currentTheme === "default" ? "Switch to Night mode" : "Switch to Day mode"}
      >
        <div className="relative w-5 h-5">
          <Sun
            className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
              currentTheme === "default" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
            }`}
            strokeWidth={1.5}
          />
          <Moon
            className={`absolute inset-0 w-5 h-5 transition-all duration-500 ${
              currentTheme === "dark" ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
            }`}
            strokeWidth={1.5}
          />
        </div>
      </button>
    </div>
  )
}

export default ThemeSwitcher
