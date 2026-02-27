'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { fetchWeather, type WeatherData } from '@/lib/weather'

const TZ = 'America/New_York'
const WEATHER_REFRESH_MS = 30 * 60 * 1000 // 30 minutes
const TIME_REFRESH_MS = 60 * 1000 // 1 minute

// Module-level weather cache so navigating away and back doesn't re-fetch
let weatherCache: { data: WeatherData; fetchedAt: number } | null = null

// --- Date/time external store (updates every 60s) ---

let dateTimeSnapshot = { date: '', time: '' }
const dateTimeListeners = new Set<() => void>()

function emitDateTimeChange() {
  dateTimeListeners.forEach((fn) => fn())
}

function formatDate(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  }).format(new Date())
}

function formatTime(): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  }).format(new Date())
}

function tickDateTime() {
  dateTimeSnapshot = { date: formatDate(), time: formatTime() }
  emitDateTimeChange()
}

// Start the timer once on the client
let timerStarted = false
function ensureTimer() {
  if (timerStarted) return
  timerStarted = true
  tickDateTime()
  setInterval(tickDateTime, TIME_REFRESH_MS)
}

function subscribeDateTime(callback: () => void) {
  ensureTimer()
  dateTimeListeners.add(callback)
  return () => { dateTimeListeners.delete(callback) }
}

function getDateTimeSnapshot() {
  ensureTimer()
  return dateTimeSnapshot
}

const SERVER_SNAPSHOT = { date: '', time: '' }
function getDateTimeServerSnapshot() {
  return SERVER_SNAPSHOT
}

/**
 * Hook returning a live dateline for Cranston, RI.
 * Date/time uses useSyncExternalStore (updates every 60s).
 * Weather fetches on mount and refreshes every 30m with module-level cache.
 * Returns empty strings during SSR for hydration safety.
 */
export function useDateline() {
  const { date, time } = useSyncExternalStore(subscribeDateTime, getDateTimeSnapshot, getDateTimeServerSnapshot)
  const [weather, setWeather] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadWeather() {
      // Use cache if fresh
      if (weatherCache && Date.now() - weatherCache.fetchedAt < WEATHER_REFRESH_MS) {
        setWeather(`${weatherCache.data.temp}\u00B0F ${weatherCache.data.condition}`)
        return
      }

      const data = await fetchWeather()
      if (cancelled) return

      if (data) {
        weatherCache = { data, fetchedAt: Date.now() }
        setWeather(`${data.temp}\u00B0F ${data.condition}`)
      }
    }

    loadWeather()

    const interval = setInterval(loadWeather, WEATHER_REFRESH_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { date, time, weather }
}
