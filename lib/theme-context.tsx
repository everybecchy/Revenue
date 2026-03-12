"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useNextTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return {
      theme: "light",
      setTheme: () => {},
      toggleTheme: () => {},
    }
  }

  return {
    theme: theme as "light" | "dark" | "system",
    setTheme,
    toggleTheme: () => {
      setTheme(theme === "dark" ? "light" : "dark")
    },
  }
}
