'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import { DocumentationSection, Project } from '@/types/sanity'
import PortableText from '@/components/content/PortableText'
import { ProjectCard } from '@/components/content'

const PROJECTS_SLUG = 'projects'

interface DocumentationContentProps {
  sections: DocumentationSection[]
  projects: Project[]
}

interface SidebarItem {
  id: string
  slug: string
  title: string
  type: 'section' | 'projects'
}

function buildSidebarItems(sections: DocumentationSection[]): SidebarItem[] {
  const items: SidebarItem[] = []

  for (const section of sections) {
    items.push({
      id: section._id,
      slug: section.slug.current,
      title: section.title,
      type: 'section',
    })

    // Insert "Projects" after "now"
    if (section.slug.current === 'now') {
      items.push({
        id: 'projects',
        slug: PROJECTS_SLUG,
        title: 'Projects',
        type: 'projects',
      })
    }
  }

  return items
}

function DocumentationInner({ sections, projects }: DocumentationContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('section')
  const selectedSection = sections.find(s => s.slug.current === selectedSlug) ?? null
  const isProjectsSelected = selectedSlug === PROJECTS_SLUG

  const sidebarItems = buildSidebarItems(sections)
  const publicProjects = projects.filter(p => p.category !== 'internal')
  const internalProjects = projects.filter(p => p.category === 'internal')

  if (sections.length === 0) {
    return (
      <div className="bg-sdm-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="font-cooper text-3xl md:text-4xl text-sdm-text mb-8">Notes</h1>
          <p className="font-cooper text-lg text-sdm-text-light">No sections available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sdm-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-cooper text-3xl md:text-4xl text-sdm-text mb-8">Notes</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar menu */}
          <nav className="md:w-56 shrink-0" aria-label="Notes sections">
            <ul className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:sticky md:top-24">
              {sidebarItems.map(item => (
                <li key={item.id} className="shrink-0">
                  <button
                    onClick={() => router.push(`/documentation?section=${item.slug}`, { scroll: false })}
                    className={`font-cooper text-lg text-left transition-colors duration-200 px-3 py-2 rounded-md whitespace-nowrap md:whitespace-normal w-full ${
                      selectedSlug === item.slug
                        ? 'text-sdm-primary font-bold bg-sdm-card shadow-sm border border-sdm-border'
                        : 'text-sdm-text-light hover:text-sdm-primary hover:bg-sdm-card/50'
                    }`}
                    aria-current={selectedSlug === item.slug ? 'true' : undefined}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {!selectedSection && !isProjectsSelected && (
              <div className="flex justify-center">
                <Image
                  src="/documentation-hero.webp"
                  alt="Notes"
                  width={1920}
                  height={1280}
                  className="rounded-lg shadow-md max-w-lg w-full h-auto"
                  priority
                />
              </div>
            )}

            {isProjectsSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  Projects
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  Things I&apos;m building and maintaining.
                </p>
                {projects.length > 0 ? (
                  <>
                    {publicProjects.length > 0 && (
                      <div className="mb-16">
                        <div className="text-center mb-4"><h3 className="font-cooper text-xl text-sdm-primary inline-block px-6 py-2 border-2 border-sdm-text/30 rounded-md">Public</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {publicProjects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                          ))}
                        </div>
                      </div>
                    )}
                    {internalProjects.length > 0 && (
                      <div>
                        <div className="text-center mb-4"><h3 className="font-cooper text-xl text-sdm-primary inline-block px-6 py-2 border-2 border-sdm-text/30 rounded-md">Internal</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {internalProjects.map((project) => (
                            <ProjectCard key={project._id} project={project} variant="muted" />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sdm-text-light font-cooper">
                    No projects to show yet.
                  </p>
                )}
              </div>
            )}

            {selectedSection && !isProjectsSelected && (
              <article className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-sdm-border">
                <h2 className="font-cooper text-2xl md:text-3xl text-sdm-text mb-6">
                  {selectedSection.title}
                </h2>
                <div className="prose prose-xl max-w-none text-xl md:text-2xl font-light">
                  <PortableText content={selectedSection.content} />
                  {selectedSection.slug.current === 'colophon' && (
                    <p>
                      The footer illustration is{' '}
                      <a href="https://thedesignsquiggle.com" target="_blank" rel="noopener noreferrer" className="text-sdm-primary no-underline hover:text-sdm-accent transition-colors duration-200">
                        The Design Squiggle
                      </a>{' '}
                      by Damien Newman.
                    </p>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentationContent({ sections, projects }: DocumentationContentProps) {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <DocumentationInner sections={sections} projects={projects} />
    </Suspense>
  )
}
