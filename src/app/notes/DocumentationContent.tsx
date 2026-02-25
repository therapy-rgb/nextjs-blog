'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Suspense } from 'react'
import { DocumentationSection, Project, Link, ChangelogMonth } from '@/types/sanity'
import PortableText from '@/components/content/PortableText'
import { ProjectCard, TechStackContent } from '@/components/content'

const PROJECTS_SLUG = 'projects'
const LINKS_SLUG = 'links'
const CHANGELOG_SLUG = 'changelog'

interface DocumentationContentProps {
  sections: DocumentationSection[]
  projects: Project[]
  links: Link[]
  changelog: ChangelogMonth[]
}

interface SidebarItem {
  id: string
  slug: string
  title: string
  type: 'section' | 'projects' | 'links' | 'changelog'
}

function buildSidebarItems(sections: DocumentationSection[], hasChangelog: boolean): SidebarItem[] {
  const items: SidebarItem[] = []

  for (const section of sections) {
    items.push({
      id: section._id,
      slug: section.slug.current,
      title: section.title,
      type: 'section',
    })

    // Insert "Projects" and "Links" after "now"
    if (section.slug.current === 'now') {
      items.push({
        id: 'projects',
        slug: PROJECTS_SLUG,
        title: 'Projects',
        type: 'projects',
      })
      items.push({
        id: 'links',
        slug: LINKS_SLUG,
        title: 'Links',
        type: 'links',
      })
    }
  }

  if (hasChangelog) {
    items.push({
      id: 'changelog',
      slug: CHANGELOG_SLUG,
      title: 'Changelog',
      type: 'changelog',
    })
  }

  return items
}

function DocumentationInner({ sections, projects, links, changelog }: DocumentationContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('section')
  const selectedSection = sections.find(s => s.slug.current === selectedSlug) ?? null
  const isProjectsSelected = selectedSlug === PROJECTS_SLUG
  const isLinksSelected = selectedSlug === LINKS_SLUG
  const isChangelogSelected = selectedSlug === CHANGELOG_SLUG

  const sidebarItems = buildSidebarItems(sections, changelog.length > 0)
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
                    onClick={() => router.push(`/notes?section=${item.slug}`, { scroll: false })}
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
            {!selectedSection && !isProjectsSelected && !isLinksSelected && !isChangelogSelected && (
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

            {isLinksSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  Links
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  The web is made of links woven together. Here are a few that I love.
                </p>
                {links.length > 0 ? (
                  <ul className="flex flex-wrap gap-2">
                    {links.map((link) => (
                      <li key={link._id}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-3 py-1.5 rounded-full border border-sdm-border bg-sdm-card hover:border-sdm-primary/40 hover:shadow-sm transition-all duration-200 text-center font-cooper text-base text-sdm-text hover:text-sdm-primary"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sdm-text-light font-cooper">
                    No links yet.
                  </p>
                )}
              </div>
            )}

            {isChangelogSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  Changelog
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  Recent changes to this site.{' '}
                  <a
                    href="https://github.com/therapy-rgb/nextjs-blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sdm-accent hover:text-sdm-primary transition-colors duration-200"
                  >
                    View source on GitHub
                  </a>
                </p>
                {changelog.length > 0 ? (
                  <div className="relative border-l-2 border-sdm-border pl-6 ml-2">
                    {changelog.map(month => (
                      <div key={month.yearMonth} className="mb-10">
                        <h3 className="font-cooper text-xl text-sdm-primary font-bold mb-4 -ml-[calc(1.5rem+2px)] pl-6 relative">
                          <span className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-sdm-primary" />
                          {month.label}
                        </h3>
                        <ul className="space-y-3">
                          {month.entries.map(entry => (
                            <li key={entry.sha} className="relative">
                              <span className="absolute -left-[calc(1.5rem+5px)] top-2 w-2 h-2 rounded-full bg-sdm-border" />
                              <p className="font-cooper text-sdm-text">{entry.message}</p>
                              <p className="text-sm text-sdm-text-light mt-0.5">
                                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                {' · '}
                                <a
                                  href={entry.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sdm-accent hover:text-sdm-primary transition-colors duration-200"
                                >
                                  {entry.sha.slice(0, 7)}
                                </a>
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sdm-text-light font-cooper">
                    No changelog entries available.
                  </p>
                )}
              </div>
            )}

            {selectedSection && !isProjectsSelected && !isLinksSelected && !isChangelogSelected && (
              <article className="p-6 md:p-12 rounded-lg shadow-md bg-sdm-card border border-sdm-border">
                <h2 className="font-cooper text-2xl md:text-3xl text-sdm-text mb-6">
                  {selectedSection.title}
                </h2>
                {selectedSection.slug.current === 'tech-stack' ? (
                  <TechStackContent content={selectedSection.content} />
                ) : (
                  <div className="prose prose-xl max-w-none text-xl md:text-2xl font-light">
                    <PortableText content={selectedSection.content} />
                  </div>
                )}
              </article>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentationContent({ sections, projects, links, changelog }: DocumentationContentProps) {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <DocumentationInner sections={sections} projects={projects} links={links} changelog={changelog} />
    </Suspense>
  )
}
