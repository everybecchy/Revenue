"use client"

import { useEffect, useState } from "react"

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("light")
  const [nextThemeHook, setNextThemeHook] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    
    // Dynamically import and call next-themes hook on client side
    try {
      const { useTheme: useNextTheme } = require("next-themes")
      const hook = useNextTheme()
      setNextThemeHook(hook)
      if (hook?.theme) {
        setThemeState(hook.theme)
      }
    } catch (e) {
      // next-themes not available or error occurred
    }
  }, [])

  const toggleTheme = () => {
    if (nextThemeHook?.setTheme) {
      const newTheme = theme === "dark" ? "light" : "dark"
      nextThemeHook.setTheme(newTheme)
      setThemeState(newTheme)
    }
  }

  return {
    theme,
    setTheme: (newTheme: string) => {
      setThemeState(newTheme as "light" | "dark" | "system")
      if (nextThemeHook?.setTheme) {
        nextThemeHook.setTheme(newTheme)
      }
    },
    toggleTheme,
    mounted,
  }
}

    }

    // Now use the hook
    if (useNextTheme) {
      try {
        const nextThemeHook = useNextTheme()
        if (nextThemeHook?.theme) {
          setThemeState(nextThemeHook.theme as "light" | "dark" | "system")
        }
      } catch (e) {
        // Failed to get theme from next-themes
      }
    }
  }, [])

  const toggleTheme = () => {
    if (useNextTheme) {
      try {
        const nextThemeHook = useNextTheme()
        const newTheme = theme === "dark" ? "light" : "dark"
        nextThemeHook?.setTheme(newTheme)
        setThemeState(newTheme)
      } catch (e) {
        // Failed to toggle theme
      }
    }
  }

  return {
    theme,
    setTheme: (newTheme: string) => {
      setThemeState(newTheme as "light" | "dark" | "system")
      if (useNextTheme) {
        try {
          const nextThemeHook = useNextTheme()
          nextThemeHook?.setTheme(newTheme)
        } catch (e) {
          // Failed to set theme
        }
      }
    },
    toggleTheme,
    mounted,
  }
}


