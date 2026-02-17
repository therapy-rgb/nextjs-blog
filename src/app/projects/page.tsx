import type { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { ProjectCard } from '@/components/content'
import { client, projectsQuery } from '@/lib/sanity'
import { Project } from '@/types/sanity'
import { logError } from '@/lib/logging'

export const metadata: Metadata = {
  title: 'Projects | Suburban Dad Mode',
  description: 'A collection of projects I build and maintain — from personal sites to creative tools.',
  alternates: {
    canonical: 'https://suburbandadmode.com/projects',
  },
  openGraph: {
    title: 'Projects | Suburban Dad Mode',
    description: 'A collection of projects I build and maintain — from personal sites to creative tools.',
    url: 'https://suburbandadmode.com/projects',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Projects | Suburban Dad Mode',
    description: 'A collection of projects I build and maintain — from personal sites to creative tools.',
  },
}

export const revalidate = 3600

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

export default async function Projects() {
  const projects = await getProjects()

  return (
    <PageContainer maxWidth="4xl">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-4">
          Projects
        </h1>
        <p className="text-sdm-text-light font-cooper text-lg max-w-2xl mx-auto">
          Things I&apos;m building and maintaining.
        </p>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sdm-text-light font-cooper">
          No projects to show yet.
        </p>
      )}
    </PageContainer>
  )
}
