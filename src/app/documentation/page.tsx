import { client, documentationSectionsQuery } from '@/lib/sanity'
import { DocumentationSection } from '@/types/sanity'
import { logError } from '@/lib/logging'
import type { Metadata } from 'next'
import DocumentationContent from './DocumentationContent'

export const metadata: Metadata = {
  title: 'Notes | Suburban Dad Mode',
  description: 'About this site — who built it, what it runs on, and how accessibility was considered.',
  alternates: {
    canonical: 'https://suburbandadmode.com/documentation',
  },
}

export const revalidate = 3600

async function getSections(): Promise<DocumentationSection[]> {
  try {
    return await client.fetch(documentationSectionsQuery)
  } catch (error) {
    logError('sanity', 'Error fetching documentation sections', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export default async function Documentation() {
  const sections = await getSections()

  return <DocumentationContent sections={sections} />
}
