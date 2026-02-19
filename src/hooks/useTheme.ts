'use client'

import { useEffect, useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'sdm-theme'
const LIGHT_COLOR = '#F3EFF5'
const DARK_COLOR = '#1B1F2E'

// Module-level listener set for same-tab localStorage notifications
const themeListeners = new Set<() => void>()

function emitChange() {
  themeListeners.forEach((fn) => fn())
}

function subscribeToTheme(callback: () => void) {
  themeListeners.add(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    themeListeners.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

function getThemeSnapshot(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') return raw
  } catch {
    // Private browsing or storage unavailable
  }
  return 'system'
}

function getThemeServerSnapshot(): Theme {
  return 'system'
}

// OS preference subscription
function subscribeToSystemPref(callback: () => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

function getSystemPrefSnapshot(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getSystemPrefServerSnapshot(): ResolvedTheme {
  return 'light'
}

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = resolved

  // Update theme-color meta tags for mobile browser chrome
  const metaTags = document.querySelectorAll('meta[name="theme-color"]')
  const color = resolved === 'dark' ? DARK_COLOR : LIGHT_COLOR
  metaTags.forEach((tag) => {
    tag.setAttribute('content', color)
  })
}

/**
 * Hook for managing theme state with light/dark/system modes.
 * Uses useSyncExternalStore to read from localStorage and OS
 * preference without triggering setState-in-effect lint violations.
 * Persists choice to localStorage, syncs across tabs, and
 * listens for OS preference changes in system mode.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot)
  const systemPref = useSyncExternalStore(subscribeToSystemPref, getSystemPrefSnapshot, getSystemPrefServerSnapshot)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemPref : theme

  // Apply theme to DOM whenever resolved theme changes
  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const setTheme = useCallback((next: Theme) => {
    try {
      if (next === 'system') {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, next)
      }
    } catch {
      // Private browsing or storage unavailable
    }
    emitChange()
  }, [])

  return { theme, resolvedTheme, systemPref, setTheme }
}
