'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="font-display text-5xl font-bold text-sdm-text mb-4">
          Something went wrong
        </h1>
        <p className="font-cooper text-lg text-sdm-text-light mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 bg-sdm-primary text-white font-cooper font-semibold rounded-lg hover:bg-sdm-accent transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
