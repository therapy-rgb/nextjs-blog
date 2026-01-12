/**
 * Environment variable validation and utilities
 */

export const getBaseUrl = (): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (!baseUrl) {
    // Fallback for development, but warn
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000'
    }
    // In production, use the known domain
    return 'https://suburbandadmode.com'
  }

  return baseUrl
}

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
