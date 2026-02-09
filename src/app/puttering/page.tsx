'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import Image from 'next/image'

const poems = [
  {
    slug: 'baby-sleeping',
    title: 'Baby sleeping',
    text: `Baby sleeping
Wife sleeping
I organize my closet
fold old curtains,
cup of joe`
  },
  {
    slug: 'its-late-at-night',
    title: "It's late at night",
    text: `It's late at night
or almost time
to feed little Natalie
a bottle
Cool air quiet
I hear you rustle
in your crib`
  },
  {
    slug: 'a-morning-nap',
    title: 'A morning nap',
    text: `A morning nap
for Natalie,
coffee cup for me
What more do you need
on a late September
Saturday`
  },
  {
    slug: 'moments-of-respite',
    title: 'Moments of respite',
    text: `Moments of respite
in a whirlwind day
Opportunities that
open & close
Fall brings out poems
for those who are ready`
  },
  {
    slug: '3am',
    title: '3am',
    text: `3am
& you've asleep
again in your bassinet
my mind not quite settled
I think about the future
wanting to get
everything right
I eat some chocolate
& listen to your gentle
breathing`
  },
  {
    slug: 'natalie-sleeps-in-her-crib',
    title: 'Natalie sleeps in her crib',
    text: `Natalie sleeps in her crib
I see her on the monitor
Katherine sleeps upstairs
she's wrestling a cold

I'm awake at midnight
messing with a website
obsessed again
by the beauty of typography`
  },
]

function PutteringContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('poem')
  const selectedIndex = selectedSlug
    ? poems.findIndex(p => p.slug === selectedSlug)
    : -1
  const selectedPoem = selectedIndex >= 0 ? poems[selectedIndex] : null
  const prevPoem = selectedIndex > 0 ? poems[selectedIndex - 1] : null
  const nextPoem = selectedIndex >= 0 && selectedIndex < poems.length - 1 ? poems[selectedIndex + 1] : null

  return (
    <div className="bg-sdm-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="sr-only">Puttering - A Collection of Poems</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar poem list */}
          <nav className="md:w-56 shrink-0" aria-label="Poem selection">
            <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:sticky md:top-24">
              {poems.map(poem => (
                <li key={poem.slug} className="shrink-0">
                  <button
                    onClick={() => router.push(`/puttering?poem=${poem.slug}`, { scroll: false })}
                    className={`font-cooper text-lg text-left transition-colors duration-200 px-3 py-2 rounded-md whitespace-nowrap md:whitespace-normal w-full ${
                      selectedSlug === poem.slug
                        ? 'text-sdm-primary font-bold bg-sdm-card shadow-sm border border-warm-gray-200'
                        : 'text-sdm-text-light hover:text-sdm-primary hover:bg-sdm-card/50'
                    }`}
                    aria-current={selectedSlug === poem.slug ? 'true' : undefined}
                  >
                    {poem.title}
                  </button>
                </li>
              ))}
            </ul>
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
                <div className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-warm-gray-200">
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

export default function Puttering() {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <PutteringContent />
    </Suspense>
  )
}
