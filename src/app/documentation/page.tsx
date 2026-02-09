'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

const sections = [
  {
    slug: 'about-me',
    title: 'About Me',
    content: `I'm a dad living in the suburbs, writing about the small moments that make up a life. This blog is a place for me to collect thoughts, share poems, and document the day-to-day.

When I'm not writing here, I'm probably mowing the lawn, organizing a closet, or making a cup of coffee at an unreasonable hour. I believe in the beauty of ordinary routines.

Thanks for stopping by.`,
  },
  {
    slug: 'now',
    title: 'Now',
    content: `This is a "now page" — a concept inspired by Derek Sivers. It tells you what I'm focused on at this point in my life.

Right now I'm spending most of my time with family, tinkering with this website, and trying to read more. I've been getting into early morning walks and finding small pockets of quiet in an otherwise busy household.

Last updated: February 2026.`,
  },
  {
    slug: 'accessibility',
    title: 'Accessibility',
    content: `I built this site with accessibility in mind. It works with screen readers and keyboard navigation, and you can zoom or resize text without breaking the layout. Images include descriptions, and text is sized and contrasted for readability. There's a skip-to-content link for keyboard users, and the mobile menu traps focus so you don't get lost behind it.

The site uses semantic HTML throughout — proper headings, landmarks, navigation elements, and article tags — so assistive technology can make sense of the structure. Interactive elements meet minimum touch target sizes, and animations are disabled for users who prefer reduced motion.

One note: the poems on the Puttering page are displayed in a handwritten script font (TT Disruptors). This is an intentional artistic choice — the style is meant to evoke the feeling of handwriting rather than optimize for legibility. The poem text is still accessible to screen readers as plain text.`,
  },
  {
    slug: 'colophon',
    title: 'Colophon',
    content: `This site is built with Next.js and React, with content managed through Sanity CMS. It's styled with Tailwind CSS, hosted on Vercel, uses Upstash Redis for rate limiting, and Sentry for error tracking. It was coded using Claude Code.`,
  },
]

function DocumentationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('section')
  const selectedSection = sections.find(s => s.slug === selectedSlug) ?? null

  return (
    <div className="bg-sdm-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-cooper text-3xl md:text-4xl text-sdm-text mb-8">Documentation</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar menu */}
          <nav className="md:w-56 shrink-0" aria-label="Documentation sections">
            <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:sticky md:top-24">
              {sections.map(section => (
                <li key={section.slug} className="shrink-0">
                  <button
                    onClick={() => router.push(`/documentation?section=${section.slug}`, { scroll: false })}
                    className={`font-cooper text-lg text-left transition-colors duration-200 px-3 py-2 rounded-md whitespace-nowrap md:whitespace-normal w-full ${
                      selectedSlug === section.slug
                        ? 'text-sdm-primary font-bold bg-sdm-card shadow-sm border border-warm-gray-200'
                        : 'text-sdm-text-light hover:text-sdm-primary hover:bg-sdm-card/50'
                    }`}
                    aria-current={selectedSlug === section.slug ? 'true' : undefined}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {!selectedSection && (
              <div className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-warm-gray-200">
                <p className="font-cooper text-lg text-sdm-text-light">
                  Select a section from the menu to read more.
                </p>
              </div>
            )}

            {selectedSection && (
              <article className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-warm-gray-200">
                <h2 className="font-cooper text-2xl md:text-3xl text-sdm-text mb-6">
                  {selectedSection.title}
                </h2>
                <div className="font-cooper text-lg leading-relaxed text-sdm-text whitespace-pre-line">
                  {selectedSection.content}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Documentation() {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <DocumentationContent />
    </Suspense>
  )
}
