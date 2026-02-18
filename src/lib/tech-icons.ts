import type { IconType } from 'react-icons'
import {
  SiNextdotjs,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiJavascript,
  SiSanity,
  SiVercel,
  SiSentry,
  SiRedis,
  SiGithub,
  SiNodedotjs,
  SiPython,
  SiRust,
  SiDocker,
  SiPostgresql,
  SiMongodb,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiGraphql,
  SiVite,
  SiVitest,
  SiEslint,
  SiMarkdown,
  SiGit,
  SiNpm,
  SiHtml5,
  SiCss3,
} from 'react-icons/si'

/**
 * Maps normalized tech names to their Simple Icons react-icon component.
 * Keys should be lowercase with no version numbers.
 */
const TECH_ICON_MAP: Record<string, IconType> = {
  'next.js': SiNextdotjs,
  'next': SiNextdotjs,
  'nextjs': SiNextdotjs,
  'react': SiReact,
  'react native': SiReact,
  'tailwind': SiTailwindcss,
  'tailwind css': SiTailwindcss,
  'tailwindcss': SiTailwindcss,
  'typescript': SiTypescript,
  'javascript': SiJavascript,
  'sanity': SiSanity,
  'sanity cms': SiSanity,
  'vercel': SiVercel,
  'sentry': SiSentry,
  'redis': SiRedis,
  'upstash': SiRedis,
  'upstash redis': SiRedis,
  'github': SiGithub,
  'node': SiNodedotjs,
  'node.js': SiNodedotjs,
  'nodejs': SiNodedotjs,
  'python': SiPython,
  'rust': SiRust,
  'docker': SiDocker,
  'postgresql': SiPostgresql,
  'postgres': SiPostgresql,
  'mongodb': SiMongodb,
  'mongo': SiMongodb,
  'prisma': SiPrisma,
  'supabase': SiSupabase,
  'firebase': SiFirebase,
  'graphql': SiGraphql,
  'vite': SiVite,
  'vitest': SiVitest,
  'eslint': SiEslint,
  'markdown': SiMarkdown,
  'git': SiGit,
  'npm': SiNpm,
  'html': SiHtml5,
  'css': SiCss3,
}

/**
 * Strips version numbers and common suffixes from a tech name,
 * then looks up the matching icon component.
 *
 * Examples:
 *   "Next.js 16" → SiNextdotjs
 *   "Tailwind v4" → SiTailwindcss
 *   "React 19"   → SiReact
 */
export function getTechIcon(techName: string): IconType | null {
  const normalized = techName
    .toLowerCase()
    .replace(/\s*v?\d+(\.\d+)*\s*$/i, '') // strip trailing version (e.g. " 16", " v4", " 19.2")
    .trim()

  return TECH_ICON_MAP[normalized] ?? null
}
