import { client, documentationSectionsQuery, projectsQuery } from '@/lib/sanity'
import { DocumentationSection, Project } from '@/types/sanity'
import { logError } from '@/lib/logging'
import { getChangelog } from '@/lib/github'
import type { Metadata } from 'next'
import DocumentationContent from './DocumentationContent'

export const metadata: Metadata = {
  title: 'Notes | Suburban Dad Mode',
  description: 'About this site — who built it, what it runs on, and how accessibility was considered.',
  alternates: {
    canonical: 'https://suburbandadmode.com/notes',
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

async function getProjects(): Promise<Project[]> {
  try {
    return await client.fetch(projectsQuery)
  } catch (error) {
    logError('sanity', 'Error fetching projects', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export default async function Documentation() {
  const [sections, projects, changelog] = await Promise.all([
    getSections(),
    getProjects(),
    getChangelog(),
  ])

  return <DocumentationContent sections={sections} projects={projects} changelog={changelog} />
}
