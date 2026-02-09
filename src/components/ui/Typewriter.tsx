'use client'

import { useState, useEffect } from 'react'

interface TypewriterProps {
  text: string
  className?: string
  delay?: number
}

export default function Typewriter({ text, className = '', delay = 100 }: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')

  useEffect(() => {
    if (displayed.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [displayed, text, delay])

  return (
    <p className={className}>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-sdm-text align-text-bottom ml-[1px] animate-pulse" />
      )}
    </p>
  )
}
