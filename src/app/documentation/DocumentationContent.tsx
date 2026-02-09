'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import { DocumentationSection } from '@/types/sanity'
import PortableText from '@/components/content/PortableText'

interface DocumentationContentProps {
  sections: DocumentationSection[]
}

function DocumentationInner({ sections }: DocumentationContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('section')
  const selectedSection = sections.find(s => s.slug.current === selectedSlug) ?? null

  if (sections.length === 0) {
    return (
      <div className="bg-sdm-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="font-cooper text-3xl md:text-4xl text-sdm-text mb-8">Documentation</h1>
          <p className="font-cooper text-lg text-sdm-text-light">No sections available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sdm-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-cooper text-3xl md:text-4xl text-sdm-text mb-8">Documentation</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar menu */}
          <nav className="md:w-56 shrink-0" aria-label="Documentation sections">
            <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:sticky md:top-24">
              {sections.map(section => (
                <li key={section._id} className="shrink-0">
                  <button
                    onClick={() => router.push(`/documentation?section=${section.slug.current}`, { scroll: false })}
                    className={`font-cooper text-lg text-left transition-colors duration-200 px-3 py-2 rounded-md whitespace-nowrap md:whitespace-normal w-full ${
                      selectedSlug === section.slug.current
                        ? 'text-sdm-primary font-bold bg-sdm-card shadow-sm border border-warm-gray-200'
                        : 'text-sdm-text-light hover:text-sdm-primary hover:bg-sdm-card/50'
                    }`}
                    aria-current={selectedSlug === section.slug.current ? 'true' : undefined}
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
              <div className="flex justify-center">
                <Image
                  src="/documentation-hero.webp"
                  alt="Documentation"
                  width={1920}
                  height={1280}
                  className="rounded-lg shadow-md max-w-lg w-full h-auto"
                  priority
                />
              </div>
            )}

            {selectedSection && (
              <article className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-warm-gray-200">
                <h2 className="font-cooper text-2xl md:text-3xl text-sdm-text mb-6">
                  {selectedSection.title}
                </h2>
                <div className="font-cooper text-lg leading-relaxed text-sdm-text prose prose-lg max-w-none">
                  <PortableText content={selectedSection.content} />
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentationContent({ sections }: DocumentationContentProps) {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <DocumentationInner sections={sections} />
    </Suspense>
  )
}
