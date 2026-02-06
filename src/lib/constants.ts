/**
 * Centralized site configuration
 * All site-wide constants should be defined here
 */

// Site Identity
export const SITE_NAME = 'Suburban Dad Mode';
export const SITE_DOMAIN = 'suburbandadmode.com';
export const SITE_URL = 'https://suburbandadmode.com';
export const SITE_DESCRIPTION = 'A personal blog about family, finances, music, and suburban life.';

// Contact & Social
export const CONTACT_EMAIL = 'hello@suburbandadmode.com';
export const SOCIAL_HANDLES = {
  twitter: '@suburbandadmode',
  instagram: '@suburbandadmode',
  github: 'therapy-rgb',
} as const;

// Default Author
export const DEFAULT_AUTHOR = {
  name: 'Marcus Berley',
  email: 'hello@suburbandadmode.com',
  url: SITE_URL,
} as const;

// Cache & Revalidation (in seconds)
export const CACHE_CONFIG = {
  /** Default page revalidation time */
  defaultRevalidate: 3600, // 1 hour
  /** Journal/post listing revalidation */
  listingRevalidate: 3600, // 1 hour
  /** Individual post revalidation */
  postRevalidate: 3600, // 1 hour
  /** Static page revalidation (about, contact, etc.) */
  staticRevalidate: 86400, // 24 hours
  /** RSS feed revalidation */
  feedRevalidate: 3600, // 1 hour
} as const;

// SEO Defaults
export const SEO_DEFAULTS = {
  titleTemplate: `%s | ${SITE_NAME}`,
  defaultTitle: SITE_NAME,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: SITE_NAME,
  },
  twitter: {
    cardType: 'summary_large_image',
    handle: SOCIAL_HANDLES.twitter,
  },
} as const;

// Pagination
export const PAGINATION = {
  postsPerPage: 10,
  journalEntriesPerPage: 10,
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  DEFAULT: {
    MAX_REQUESTS: 10,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  MAX_REQUEST_SIZE: 10 * 1024, // 10KB
} as const;

// Allowed Origins (for CSRF protection on future API routes)
export function getAllowedOrigins(): string[] {
  const origins = [
    `https://${SITE_DOMAIN}`,
    `https://www.${SITE_DOMAIN}`,
  ]

  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000')
  }

  return origins
}
