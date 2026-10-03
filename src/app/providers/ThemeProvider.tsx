// src/app/providers/ThemeProvider.tsx
import { useLayoutEffect, useState, type PropsWithChildren } from 'react'
import { ThemeContext, type Theme } from './ThemeContext'

const storageKey = 'sonnda-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  try {
    const savedTheme = window.localStorage.getItem(storageKey)
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useLayoutEffect(() => {
    const root = document.documentElement
    const contrastPreference = window.matchMedia?.('(prefers-contrast: more)')

    root.dataset.theme = theme
    root.classList.remove('light', 'dark', 'light-high-contrast', 'dark-high-contrast')
    root.classList.add(theme)

    const syncContrast = (enabled: boolean) => {
      root.classList.toggle(`${theme}-high-contrast`, enabled)
    }
    const handleContrastChange = (event: MediaQueryListEvent) => syncContrast(event.matches)

    syncContrast(contrastPreference?.matches ?? false)
    contrastPreference?.addEventListener('change', handleContrastChange)

    try {
      window.localStorage.setItem(storageKey, theme)
    } catch {
      // Theme still works for the current session when storage is unavailable.
    }

    return () => {
      contrastPreference?.removeEventListener('change', handleContrastChange)
    }
  }, [theme])

  const toggleTheme = () => setTheme(current => current === 'dark' ? 'light' : 'dark')

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider