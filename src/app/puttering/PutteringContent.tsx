'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, Suspense } from 'react'
import Image from 'next/image'
import type { Poem } from '@/types/sanity'

function PutteringInner({ poems }: { poems: Poem[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('poem')
  const selectedIndex = selectedSlug
    ? poems.findIndex(p => p.slug === selectedSlug)
    : -1
  const selectedPoem = selectedIndex >= 0 ? poems[selectedIndex] : null
  const prevPoem = selectedIndex > 0 ? poems[selectedIndex - 1] : null
  const nextPoem = selectedIndex >= 0 && selectedIndex < poems.length - 1 ? poems[selectedIndex + 1] : null

  const [open, setOpen] = useState(!!selectedSlug)

  const handleSelect = (slug: string) => {
    setOpen(true)
    router.push(`/puttering?poem=${slug}`, { scroll: false })
  }

  return (
    <div className="bg-sdm-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="sr-only">Puttering - A Collection of Poems</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar dropdown */}
          <nav className="md:w-56 shrink-0 md:sticky md:top-24 md:self-start" aria-label="Poem selection">
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-2.5 px-3 text-left font-cooper text-lg font-semibold text-sdm-text border-b border-sdm-text/20 hover:bg-sdm-card/50 transition-colors"
                aria-expanded={open}
              >
                Poems
                <span className={`text-sdm-text-light transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>&#9662;</span>
              </button>
              {open && (
                <ul className="py-1">
                  {poems.map(poem => (
                    <li key={poem._key}>
                      <button
                        onClick={() => handleSelect(poem.slug)}
                        className={`w-full text-left py-1.5 px-5 font-cooper text-base transition-colors duration-200 ${
                          selectedSlug === poem.slug
                            ? 'text-sdm-primary font-semibold'
                            : 'text-sdm-text-light hover:text-sdm-primary'
                        }`}
                        aria-current={selectedSlug === poem.slug ? 'true' : undefined}
                      >
                        {poem.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {/* Bookshelf image when no poem selected */}
            {!selectedPoem && (
              <div className="flex justify-center">
                <Image
                  src="/puttering-bookshelf.webp"
                  alt="Bookshelf"
                  width={500}
                  height={333}
                  className="rounded-lg shadow-lg"
                  priority
                />
              </div>
            )}

            {/* Poem display with TT Disruptors font */}
            {selectedPoem && (
              <article className="flex flex-col items-center">
                <div className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-sdm-border">
                  <div
                    className="text-left text-6xl md:text-7xl leading-tight text-sdm-text whitespace-pre-line"
                    style={{ fontFamily: "'TT Disruptors', cursive" }}
                  >
                    {selectedPoem.text}
                  </div>
                </div>

                {/* Prev/Next navigation */}
                <div className="flex items-center justify-between w-full max-w-md mt-8">
                  {prevPoem ? (
                    <button
                      onClick={() => router.push(`/puttering?poem=${prevPoem.slug}`, { scroll: false })}
                      className="font-cooper text-sdm-text-light hover:text-sdm-primary transition-colors duration-200"
                    >
                      &larr; {prevPoem.title}
                    </button>
                  ) : <span />}
                  {nextPoem ? (
                    <button
                      onClick={() => router.push(`/puttering?poem=${nextPoem.slug}`, { scroll: false })}
                      className="font-cooper text-sdm-text-light hover:text-sdm-primary transition-colors duration-200"
                    >
                      {nextPoem.title} &rarr;
                    </button>
                  ) : <span />}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PutteringContent({ poems }: { poems: Poem[] }) {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <PutteringInner poems={poems} />
    </Suspense>
  )
}
