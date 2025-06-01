"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ColorTheme = "blue" | "purple" | "green" | "orange" | "pink"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorTheme?: ColorTheme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (colorTheme: ColorTheme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "blue",
  setTheme: () => null,
  setColorTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorTheme = "blue",
  storageKey = "aws-next-express-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(defaultColorTheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove previous themes
    root.classList.remove("light", "dark")
    root.classList.remove("theme-blue", "theme-purple", "theme-green", "theme-orange", "theme-pink")

    // Apply new theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    // Apply color theme
    root.classList.add(`theme-${colorTheme}`)
  }, [theme, colorTheme])

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem(storageKey)
    const storedColor = localStorage.getItem(`${storageKey}-color`)
    
    if (stored) {
      setTheme(stored as Theme)
    }
    if (storedColor) {
      setColorTheme(storedColor as ColorTheme)
    }
  }, [storageKey])

  const value = {
    theme,
    colorTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
    setColorTheme: (colorTheme: ColorTheme) => {
      localStorage.setItem(`${storageKey}-color`, colorTheme)
      setColorTheme(colorTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
