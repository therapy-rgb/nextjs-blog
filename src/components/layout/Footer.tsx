'use client'

import { usePathname } from 'next/navigation'

function HomeArt() {
  return (
    <svg width="200" height="40" viewBox="0 0 200 40" className="text-sdm-text-light" aria-hidden="true">
      <line x1="10" y1="20" x2="80" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="120" y1="20" x2="190" y2="20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function LaFamiliaArt() {
  const star = (cx: number, cy: number, r: number) => {
    const points = []
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * (Math.PI / 180)
      const innerAngle = ((i * 72 + 36) - 90) * (Math.PI / 180)
      points.push(`${cx + r * Math.cos(outerAngle)},${cy + r * Math.sin(outerAngle)}`)
      points.push(`${cx + r * 0.4 * Math.cos(innerAngle)},${cy + r * 0.4 * Math.sin(innerAngle)}`)
    }
    return points.join(' ')
  }
  return (
    <svg width="200" height="40" viewBox="0 0 200 40" className="text-sdm-text-light" aria-hidden="true">
      <line x1="10" y1="20" x2="65" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <polygon points={star(82, 20, 7)} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points={star(100, 20, 7)} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <polygon points={star(118, 20, 7)} fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="135" y1="20" x2="190" y2="20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function PutteringArt() {
  return (
    <svg width="200" height="40" viewBox="0 0 200 40" className="text-sdm-text-light" aria-hidden="true">
      <path d="M10 20 Q55 8, 100 20 T190 20" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function JournalArt() {
  return (
    <svg width="200" height="40" viewBox="0 0 200 40" className="text-sdm-text-light" aria-hidden="true">
      <line x1="10" y1="15" x2="190" y2="15" stroke="currentColor" strokeWidth="1.5" />
      <line x1="30" y1="25" x2="170" y2="25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function Footer() {
  const pathname = usePathname()

  let Art = HomeArt
  if (pathname.startsWith('/la-familia')) {
    Art = LaFamiliaArt
  } else if (pathname.startsWith('/puttering')) {
    Art = PutteringArt
  } else if (pathname.startsWith('/journal') || pathname.startsWith('/posts')) {
    Art = JournalArt
  }

  return (
    <footer className="border-t border-warm-gray-200 mt-20 bg-sdm-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <Art />
      </div>
    </footer>
  )
}