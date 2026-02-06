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
  const selectedPoem = selectedSlug
    ? poems.find(p => p.slug === selectedSlug)
    : null

  return (
    <div className="bg-sdm-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Bookshelf image when no poem selected */}
        {!selectedPoem && (
          <div className="flex justify-center mb-8">
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

        {/* Centered dropdown */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedSlug || ''}
            onChange={(e) => {
              if (e.target.value) {
                router.push(`/puttering?poem=${e.target.value}`, { scroll: false })
              } else {
                router.push('/puttering', { scroll: false })
              }
            }}
            className="w-full max-w-xs px-4 py-3 border border-warm-gray-300 rounded bg-white text-sdm-text font-cooper font-medium text-center appearance-none cursor-pointer"
          >
            <option value="">Select a poem</option>
            {poems.map(poem => (
              <option key={poem.slug} value={poem.slug}>{poem.title}</option>
            ))}
          </select>
        </div>

        {/* Poem display with TT Disruptors font */}
        {selectedPoem && (
          <article className="flex justify-center">
            <div className="p-6 md:p-12 rounded shadow-md" style={{ backgroundColor: '#FAF6EF' }}>
              <div
                className="text-left text-6xl md:text-7xl leading-tight text-sdm-text whitespace-pre-line"
                style={{ fontFamily: "'TT Disruptors', cursive" }}
              >
                {selectedPoem.text}
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

export default function Puttering() {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center">Loading...</div>}>
      <PutteringContent />
    </Suspense>
  )
}
