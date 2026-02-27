'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, Suspense } from 'react'
import { DocumentationSection, Project, Link, ChangelogMonth, HouseItem, CarItem, FinanceItem, BookGroupItem } from '@/types/sanity'
import PortableText from '@/components/content/PortableText'
import { ProjectCard, TechStackContent } from '@/components/content'

const HOUSE_SLUG = 'house'
const CARS_SLUG = 'cars'
const FINANCES_SLUG = 'finances'
const BOOKGROUP_SLUG = 'book-group'
const PROJECTS_SLUG = 'projects'
const LINKS_SLUG = 'links'
const CHANGELOG_SLUG = 'changelog'

interface DocumentationContentProps {
  sections: DocumentationSection[]
  projects: Project[]
  links: Link[]
  changelog: ChangelogMonth[]
  houseItems: HouseItem[]
  carItems: CarItem[]
  financeItems: FinanceItem[]
  bookGroupItems: BookGroupItem[]
}

interface SidebarItem {
  id: string
  slug: string
  title: string
  type: 'section' | 'house' | 'cars' | 'finances' | 'book-group' | 'projects' | 'links' | 'changelog'
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

    // Insert "House", "Projects", and "Links" after "now"
    if (section.slug.current === 'now') {
      items.push({
        id: 'house',
        slug: HOUSE_SLUG,
        title: 'House',
        type: 'house',
      })
      items.push({
        id: 'cars',
        slug: CARS_SLUG,
        title: 'Cars',
        type: 'cars',
      })
      items.push({
        id: 'finances',
        slug: FINANCES_SLUG,
        title: 'Finances',
        type: 'finances',
      })
      items.push({
        id: 'book-group',
        slug: BOOKGROUP_SLUG,
        title: 'Book Group',
        type: 'book-group',
      })
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

const HOUSE_CATEGORIES = [
  { value: 'maintenance', label: 'Maintenance', icon: '🔧', accent: 'border-sdm-primary/40 bg-sdm-primary/5' },
  { value: 'repairs', label: 'Repairs', icon: '🛠️', accent: 'border-sdm-accent/40 bg-sdm-accent/5' },
  { value: 'upgrades', label: 'Upgrades', icon: '✨', accent: 'border-sdm-text-light/30 bg-sdm-surface-subtle' },
] as const

const CAR_VEHICLES = [
  { value: 'rav4', label: 'Rav4', icon: '🚙' },
  { value: 'bolt-euv', label: 'Bolt EUV', icon: '⚡' },
] as const

const CAR_CATEGORIES = [
  { value: 'maintenance', label: 'Maintenance', accent: 'border-sdm-primary/40 bg-sdm-primary/5' },
  { value: 'repairs', label: 'Repairs', accent: 'border-sdm-accent/40 bg-sdm-accent/5' },
] as const

const FINANCE_GROUPS = [
  { value: 'taxes-2025', label: 'Taxes 2025', icon: '🧾' },
] as const

function DocumentationInner({ sections, projects, links, changelog, houseItems, carItems, financeItems, bookGroupItems }: DocumentationContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedSlug = searchParams.get('section')
  const selectedSection = sections.find(s => s.slug.current === selectedSlug) ?? null
  const isHouseSelected = selectedSlug === HOUSE_SLUG
  const isCarsSelected = selectedSlug === CARS_SLUG
  const isFinancesSelected = selectedSlug === FINANCES_SLUG
  const isBookGroupSelected = selectedSlug === BOOKGROUP_SLUG
  const isProjectsSelected = selectedSlug === PROJECTS_SLUG
  const isLinksSelected = selectedSlug === LINKS_SLUG
  const isChangelogSelected = selectedSlug === CHANGELOG_SLUG

  const [open, setOpen] = useState(!!selectedSlug)
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
          {/* Sidebar dropdown */}
          <nav className="md:w-56 shrink-0 md:sticky md:top-24 md:self-start" aria-label="Notes sections">
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-2.5 px-3 text-left font-cooper text-lg font-semibold text-sdm-text border-b border-sdm-text/20 hover:bg-sdm-card/50 transition-colors"
                aria-expanded={open}
              >
                Notes
                <span className={`text-sdm-text-light transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>&#9662;</span>
              </button>
              {open && (
                <ul className="py-1">
                  {sidebarItems.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setOpen(true)
                          router.push(`/notes?section=${item.slug}`, { scroll: false })
                        }}
                        className={`w-full text-left py-1.5 px-5 font-cooper text-base transition-colors duration-200 ${
                          selectedSlug === item.slug
                            ? 'text-sdm-primary font-semibold'
                            : 'text-sdm-text-light hover:text-sdm-primary'
                        }`}
                        aria-current={selectedSlug === item.slug ? 'true' : undefined}
                      >
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </nav>

          {/* Main content area */}
          <div className="flex-1 min-w-0">
            {!selectedSection && !isHouseSelected && !isCarsSelected && !isFinancesSelected && !isBookGroupSelected && !isProjectsSelected && !isLinksSelected && !isChangelogSelected && (
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

            {isHouseSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  House
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  The never-ending list of things a house needs.
                </p>

                {houseItems.length > 0 ? (
                  <>
                    {HOUSE_CATEGORIES.map(({ value, label, icon, accent }) => {
                      const items = houseItems.filter(item => item.category === value)
                      if (items.length === 0) return null
                      return (
                        <section key={value} className="mb-12">
                          <div className="text-center mb-4">
                            <h3 className="font-cooper text-xl text-sdm-primary inline-block px-6 py-2 border-2 border-sdm-text/30 rounded-md">
                              {icon} {label}
                            </h3>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {items.map(item => (
                              <li
                                key={item._id}
                                className={`font-cooper text-sdm-text px-4 py-3 rounded-lg border-l-4 ${accent} transition-all duration-200 hover:shadow-sm`}
                              >
                                {item.title}
                              </li>
                            ))}
                          </ul>
                        </section>
                      )
                    })}
                  </>
                ) : (
                  <p className="text-sdm-text-light font-cooper">No house items yet.</p>
                )}
              </div>
            )}

            {isCarsSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  Cars
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  Keeping the fleet running.
                </p>

                {carItems.length > 0 ? (
                  <>
                    {CAR_VEHICLES.map(({ value: carValue, label: carLabel, icon: carIcon }) => {
                      const carSpecificItems = carItems.filter(item => item.car === carValue)
                      if (carSpecificItems.length === 0) return null
                      return (
                        <section key={carValue} className="mb-16">
                          <div className="text-center mb-6">
                            <h3 className="font-cooper text-2xl text-sdm-text inline-block px-8 py-3 border-2 border-sdm-text/30 rounded-md font-bold">
                              {carIcon} {carLabel}
                            </h3>
                          </div>
                          {CAR_CATEGORIES.map(({ value: catValue, label: catLabel, accent }) => {
                            const items = carSpecificItems.filter(item => item.category === catValue)
                            if (items.length === 0) return null
                            return (
                              <div key={catValue} className="mb-8">
                                <h4 className="font-cooper text-lg text-sdm-primary font-bold mb-3 ml-1">
                                  {catValue === 'maintenance' ? '🔧' : '🛠️'} {catLabel}
                                </h4>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {items.map(item => (
                                    <li
                                      key={item._id}
                                      className={`font-cooper text-sdm-text px-4 py-3 rounded-lg border-l-4 ${accent} transition-all duration-200 hover:shadow-sm`}
                                    >
                                      {item.title}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          })}
                        </section>
                      )
                    })}
                  </>
                ) : (
                  <p className="text-sdm-text-light font-cooper">No car items yet.</p>
                )}
              </div>
            )}

            {isFinancesSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  Finances
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  Keeping the money stuff organized.
                </p>

                {financeItems.length > 0 ? (
                  <>
                    {FINANCE_GROUPS.map(({ value: groupValue, label: groupLabel, icon: groupIcon }) => {
                      const groupItems = financeItems.filter(item => item.group === groupValue)
                      if (groupItems.length === 0) return null
                      return (
                        <section key={groupValue} className="mb-12">
                          <div className="text-center mb-6">
                            <h3 className="font-cooper text-2xl text-sdm-text inline-block px-8 py-3 border-2 border-sdm-text/30 rounded-md font-bold">
                              {groupIcon} {groupLabel}
                            </h3>
                          </div>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {groupItems.map(item => (
                              <li
                                key={item._id}
                                className="font-cooper text-sdm-text px-4 py-3 rounded-lg border-l-4 border-sdm-primary/40 bg-sdm-primary/5 transition-all duration-200 hover:shadow-sm"
                              >
                                {item.title}
                              </li>
                            ))}
                          </ul>
                        </section>
                      )
                    })}
                  </>
                ) : (
                  <p className="text-sdm-text-light font-cooper">No finance items yet.</p>
                )}
              </div>
            )}

            {isBookGroupSelected && (
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold text-sdm-text mb-2">
                  Book Group
                </h2>
                <p className="text-sdm-text-light font-cooper text-lg mb-8">
                  The Providence Athenaeum hosts reading groups throughout the year. Suspicious Minds explores paranoia in literature &mdash; &quot;Paranoia comes from the Greek for &apos;beyond the mind,&apos; but are you really out of your mind if you&apos;re right?&quot; Meetings are the fourth Tuesday of the month, 5&ndash;7pm at Bound at the Athenaeum.
                </p>

                {bookGroupItems.length > 0 ? (
                  <div className="space-y-3">
                    {bookGroupItems.map(item => (
                      <div
                        key={item._id}
                        className="flex items-baseline justify-between gap-4 font-cooper px-4 py-3 rounded-lg border-l-4 border-sdm-accent/40 bg-sdm-accent/5 transition-all duration-200 hover:shadow-sm"
                      >
                        <div className="min-w-0">
                          <span className="text-sdm-text font-semibold italic">{item.title}</span>
                          <span className="text-sdm-text-light"> &mdash; {item.author}</span>
                          {item.year && <span className="text-sdm-text-light text-sm"> ({item.year})</span>}
                        </div>
                        {item.meetingDate && (
                          <span className="text-sdm-text-light text-sm whitespace-nowrap shrink-0">{item.meetingDate}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sdm-text-light font-cooper">No book group items yet.</p>
                )}
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
                          href={/^https?:\/\//i.test(link.url) ? link.url : undefined}
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

            {selectedSection && !isHouseSelected && !isCarsSelected && !isFinancesSelected && !isBookGroupSelected && !isProjectsSelected && !isLinksSelected && !isChangelogSelected && (
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

export default function DocumentationContent({ sections, projects, links, changelog, houseItems, carItems, financeItems, bookGroupItems }: DocumentationContentProps) {
  return (
    <Suspense fallback={<div className="bg-sdm-background min-h-screen flex items-center justify-center" role="status" aria-live="polite">Loading...</div>}>
      <DocumentationInner sections={sections} projects={projects} links={links} changelog={changelog} houseItems={houseItems} carItems={carItems} financeItems={financeItems} bookGroupItems={bookGroupItems} />
    </Suspense>
  )
}
