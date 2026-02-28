'use client'

import { useEffect, useCallback, useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ColorScheme = 'rose' | 'ocean' | 'forest' | 'sunset' | 'midnight' | 'grayscale'
type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'sdm-theme'
const COLOR_SCHEME_KEY = 'sdm-color-scheme'

export const COLOR_SCHEMES: { id: ColorScheme; label: string; swatch: string }[] = [
  { id: 'rose', label: 'Rose', swatch: '#C44569' },
  { id: 'ocean', label: 'Ocean', swatch: '#2563EB' },
  { id: 'forest', label: 'Forest', swatch: '#15803D' },
  { id: 'sunset', label: 'Sunset', swatch: '#C2410C' },
  { id: 'midnight', label: 'Midnight', swatch: '#7C3AED' },
  { id: 'grayscale', label: 'B/W', swatch: 'linear-gradient(135deg, #222 50%, #ddd 50%)' },
]

// === Theme (light/dark/system) subscriptions ===

const themeListeners = new Set<() => void>()

function emitThemeChange() {
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

// === Color scheme subscriptions ===

const colorSchemeListeners = new Set<() => void>()

function emitColorSchemeChange() {
  colorSchemeListeners.forEach((fn) => fn())
}

function subscribeToColorScheme(callback: () => void) {
  colorSchemeListeners.add(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === COLOR_SCHEME_KEY || e.key === null) callback()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    colorSchemeListeners.delete(callback)
    window.removeEventListener('storage', onStorage)
  }
}

function getColorSchemeSnapshot(): ColorScheme {
  try {
    const raw = localStorage.getItem(COLOR_SCHEME_KEY)
    if (raw === 'ocean' || raw === 'forest' || raw === 'sunset' || raw === 'midnight' || raw === 'grayscale') return raw
  } catch {
    // Private browsing or storage unavailable
  }
  return 'rose'
}

function getColorSchemeServerSnapshot(): ColorScheme {
  return 'rose'
}

// === OS preference subscription ===

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

// === DOM application ===

function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  root.style.colorScheme = resolved
}

function applyColorScheme(scheme: ColorScheme) {
  const root = document.documentElement
  if (scheme === 'rose') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', scheme)
  }
}

function updateMetaThemeColor() {
  const color = getComputedStyle(document.documentElement).getPropertyValue('--sdm-background').trim()
  if (color) {
    document.querySelectorAll('meta[name="theme-color"]').forEach((tag) => {
      tag.setAttribute('content', color)
    })
  }
}

/**
 * Hook for managing theme state with light/dark/system modes
 * and multiple color scheme palettes (rose, ocean, forest, sunset, midnight).
 * Uses useSyncExternalStore to read from localStorage and OS
 * preference without triggering setState-in-effect lint violations.
 * Persists choices to localStorage, syncs across tabs, and
 * listens for OS preference changes in system mode.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot)
  const systemPref = useSyncExternalStore(subscribeToSystemPref, getSystemPrefSnapshot, getSystemPrefServerSnapshot)
  const colorScheme = useSyncExternalStore(subscribeToColorScheme, getColorSchemeSnapshot, getColorSchemeServerSnapshot)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemPref : theme

  useEffect(() => {
    applyTheme(resolvedTheme)
    applyColorScheme(colorScheme)
    // Read computed background after both are applied
    requestAnimationFrame(() => updateMetaThemeColor())
  }, [resolvedTheme, colorScheme])

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
    emitThemeChange()
  }, [])

  const setColorScheme = useCallback((next: ColorScheme) => {
    try {
      if (next === 'rose') {
        localStorage.removeItem(COLOR_SCHEME_KEY)
      } else {
        localStorage.setItem(COLOR_SCHEME_KEY, next)
      }
    } catch {
      // Private browsing or storage unavailable
    }
    emitColorSchemeChange()
  }, [])

  return { theme, resolvedTheme, systemPref, colorScheme, setTheme, setColorScheme }
}
