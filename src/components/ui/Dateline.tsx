'use client'

import { useDateline } from '@/hooks/useDateline'

export default function Dateline() {
  const { date, time, weather } = useDateline()

  // Return null until hydrated to avoid mismatch
  if (!date) return null

  return (
    <p
      className="text-sdm-text-light font-cooper text-sm"
      role="status"
      aria-live="polite"
    >
      <span>{date}</span>
      <span className="mx-1.5" aria-hidden="true">&middot;</span>
      <span>{time}</span>
      <span className="mx-1.5 hidden sm:inline" aria-hidden="true">&middot;</span>
      <br className="sm:hidden" />
      <span>Cranston, RI</span>
      {weather && (
        <>
          <span className="mx-1" aria-hidden="true">&mdash;</span>
          <span>{weather}</span>
        </>
      )}
    </p>
  )
}
