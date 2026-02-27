import Image from 'next/image'
import { Project } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'
import { getTechIcon } from '@/lib/tech-icons'

/**
 * Maps project slugs to static hero images in public/projects/.
 * Used as a fallback when no Sanity image is uploaded.
 */
const STATIC_HERO_MAP: Record<string, string> = {
  'suburban-dad-mode': '/projects/suburban-dad-mode.webp',
  'methodology': '/projects/methodology.webp',
  'marcus-berley-therapy': '/projects/marcus-berley-therapy.webp',
  'claude-code-config': '/projects/claude-code-config.webp',
  'dotfiles': '/projects/dotfiles.webp',
  'marcus-system': '/projects/marcus-system.webp',
  'referral-tracker': '/projects/referral-tracker.webp',
}

interface ProjectCardProps {
  project: Project
  variant?: 'default' | 'muted'
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  const cardClass = variant === 'muted'
    ? 'bg-sdm-surface-subtle border border-sdm-border rounded-lg p-6 overflow-hidden flex flex-col'
    : 'bg-sdm-card border border-sdm-border rounded-lg shadow-sm p-6 overflow-hidden flex flex-col'

  const slug = project.slug?.current
  const staticHero = slug ? STATIC_HERO_MAP[slug] : undefined
  const hasSanityImage = !!project.image
  const hasHero = hasSanityImage || !!staticHero

  return (
    <div className={cardClass}>
      {hasHero && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4 overflow-hidden">
          {hasSanityImage ? (
            <Image
              src={urlFor(project.image!).width(600).height(300).auto('format').url()}
              alt={project.image!.alt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <Image
              src={staticHero!}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          )}
        </div>
      )}

      <h2 className="font-display text-xl font-bold text-sdm-text mb-2">
        {project.title}
      </h2>

      <p className="text-sdm-text-light font-cooper leading-relaxed mb-4 flex-1">
        {project.description}
      </p>

      {project.techStack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => {
            const Icon = getTechIcon(tech)
            return (
              <span
                key={tech}
                className="inline-flex items-center gap-1.5 text-xs font-cooper px-2.5 py-1 rounded-full bg-sdm-surface-subtle text-sdm-text-light"
              >
                {Icon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
                {tech}
              </span>
            )
          })}
        </div>
      )}

      {project.url && /^https?:\/\//i.test(project.url) && (
        <div>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sdm-primary font-cooper font-semibold hover:text-sdm-accent transition-colors duration-200"
          >
            Visit site
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  )
}
