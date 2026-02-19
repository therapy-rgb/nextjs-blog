'use client'

import { useTheme } from '@/hooks/useTheme'
import type { Theme } from '@/hooks/useTheme'

function SunIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function ComputerIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

interface ThemeToggleProps {
  variant?: 'default' | 'overlay'
}

export default function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { theme, systemPref, setTheme } = useTheme()

  // Cycle: system → opposite of system pref → match system pref → system → ...
  function getNextTheme(): Theme {
    if (theme === 'system') {
      return systemPref === 'dark' ? 'light' : 'dark'
    }
    if (theme === systemPref) {
      return 'system'
    }
    return systemPref
  }

  const nextTheme = getNextTheme()

  const icons = { light: <SunIcon />, dark: <MoonIcon />, system: <ComputerIcon /> }
  const labels = { light: 'Light', dark: 'Dark', system: 'System' }

  const baseClasses = 'inline-flex items-center gap-2 p-2 min-h-[44px] rounded-md transition-colors duration-200 text-sm font-cooper'
  const variantClasses = variant === 'overlay'
    ? 'text-white/70 hover:text-white'
    : 'text-sdm-text-light hover:text-sdm-primary'

  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses}`}
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {icons[theme]}
      <span>{labels[theme]}</span>
    </button>
  )
}
