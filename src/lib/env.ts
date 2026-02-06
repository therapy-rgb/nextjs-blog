/**
 * Environment variable validation
 * Import this module early in your app to validate required env vars at startup
 */

interface EnvConfig {
  // Sanity CMS (required for content)
  NEXT_PUBLIC_SANITY_PROJECT_ID: string
  NEXT_PUBLIC_SANITY_DATASET: string

  // Base URL (optional - defaults to production URL)
  NEXT_PUBLIC_BASE_URL: string | undefined

  // Sentry (optional - only required for error tracking)
  SENTRY_DSN: string | undefined
  NEXT_PUBLIC_SENTRY_DSN: string | undefined

  // Upstash Redis (optional - only required for rate limiting)
  UPSTASH_REDIS_REST_URL: string | undefined
  UPSTASH_REDIS_REST_TOKEN: string | undefined
}

interface ValidationResult {
  valid: boolean
  missing: string[]
  warnings: string[]
}

export function validateEnv(): ValidationResult {
  const missing: string[] = []
  const warnings: string[] = []

  // Required for content to display
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    missing.push('NEXT_PUBLIC_SANITY_PROJECT_ID')
  }
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    missing.push('NEXT_PUBLIC_SANITY_DATASET')
  }

  // Optional: Error tracking
  if (!process.env.SENTRY_DSN && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    warnings.push('SENTRY_DSN not set - error tracking will be disabled')
  }

  // Optional: Rate limiting
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    warnings.push('Upstash Redis not configured - rate limiting will use in-memory fallback')
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  }
}

// Run validation (skip during build phase)
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
const isProduction = process.env.NODE_ENV === 'production'

if (!isBuildPhase) {
  const result = validateEnv()

  if (result.missing.length > 0) {
    if (isProduction) {
      throw new Error('Missing required environment variables. Check server configuration.')
    }

    console.error('\nMissing required environment variables:')
    result.missing.forEach((name) => {
      console.error(`   - ${name}`)
    })
    console.error('\nPlease add these to your .env.local file.\n')
  }

  if (result.warnings.length > 0 && !isProduction) {
    console.warn('\nEnvironment variable warnings:')
    result.warnings.forEach((warning) => {
      console.warn(`   - ${warning}`)
    })
    console.warn('')
  }
}

// Export typed env for use in the app
export const env: EnvConfig = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  SENTRY_DSN: process.env.SENTRY_DSN,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
}

/**
 * Get the site base URL with fallbacks for dev/prod
 */
export const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  return 'https://suburbandadmode.com'
}

/**
 * Get validated Sanity configuration
 */
export const getSanityConfig = () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  if (!projectId || !dataset) {
    throw new Error(
      'Missing Sanity credentials: NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set'
    )
  }

  return { projectId, dataset }
}
