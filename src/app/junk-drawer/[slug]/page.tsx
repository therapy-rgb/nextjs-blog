import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client, journalEntryQuery, journalEntriesQuery } from '@/lib/sanity'
import { JournalEntry } from '@/types/sanity'

// Generate static params for all journal entries
export async function generateStaticParams() {
  const entries: JournalEntry[] = await client.fetch(journalEntriesQuery)
  return entries.map((entry) => ({
    slug: entry.slug.current,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry: JournalEntry = await client.fetch(journalEntryQuery, { slug })

  if (!entry) {
    return {
      title: 'Journal Entry Not Found',
    }
  }

  return {
    title: `${entry.title} | Suburban Dad Mode`,
    description: entry.excerpt || entry.title,
  }
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry: JournalEntry = await client.fetch(journalEntryQuery, { slug })

  if (!entry) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back link */}
      <Link
        href="/junk-drawer"
        className="inline-flex items-center text-sdm-primary hover:text-sdm-accent font-cooper font-semibold mb-8 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Junk Drawer
      </Link>

      {/* Article */}
      <article className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
        {/* Header */}
        <header className="mb-8 pb-8 border-b border-warm-gray-200">
          <time className="block text-sm font-semibold text-sdm-primary uppercase tracking-wide mb-4">
            {formatDate(entry.publishedAt)}
          </time>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text leading-tight">
            {entry.title}
          </h1>
        </header>

        {/* Body */}
        <div className="prose prose-lg max-w-none font-cooper">
          <PortableText
            value={entry.body}
            components={{
              block: {
                normal: ({children}) => <p className="mb-6 text-sdm-text leading-relaxed text-xl">{children}</p>,
                h1: ({children}) => <h1 className="font-display text-3xl font-bold text-sdm-text mt-12 mb-6">{children}</h1>,
                h2: ({children}) => <h2 className="font-display text-2xl font-bold text-sdm-text mt-10 mb-5">{children}</h2>,
                h3: ({children}) => <h3 className="font-display text-xl font-bold text-sdm-text mt-8 mb-4">{children}</h3>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-sdm-primary pl-6 my-8 italic text-sdm-text-light text-xl">
                    {children}
                  </blockquote>
                ),
              },
              marks: {
                strong: ({children}) => <strong className="font-bold text-sdm-text">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
                link: ({children, value}) => (
                  <a
                    href={value?.href}
                    className="text-sdm-primary hover:text-sdm-accent underline transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              },
              list: {
                bullet: ({children}) => <ul className="list-disc list-inside mb-6 space-y-2 text-xl">{children}</ul>,
                number: ({children}) => <ol className="list-decimal list-inside mb-6 space-y-2 text-xl">{children}</ol>,
              },
              listItem: {
                bullet: ({children}) => <li className="text-sdm-text">{children}</li>,
                number: ({children}) => <li className="text-sdm-text">{children}</li>,
              },
            }}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-warm-gray-200">
          <Link
            href="/junk-drawer"
            className="inline-flex items-center text-sdm-primary hover:text-sdm-accent font-cooper font-semibold transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Junk Drawer
          </Link>
        </footer>
      </article>
    </div>
  )
}
