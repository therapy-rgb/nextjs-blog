import { revalidatePath } from 'next/cache'
import { timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, createRateLimitHeaders, getClientIP, isRequestTooLarge } from '@/lib/api-security'

interface SanityWebhookPayload {
  _type: string
  slug?: string
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*$/
const VALID_TYPES = new Set(['journalEntry', 'photoGallery', 'putteringPoems', 'documentationSection', 'author', 'project'])

const REVALIDATION_PATHS: Record<string, (slug?: string) => string[]> = {
  journalEntry: (slug) => {
    const paths = ['/journal', '/feed.xml']
    if (slug) paths.push(`/journal/${slug}`)
    return paths
  },
  photoGallery: () => ['/la-familia'],
  putteringPoems: () => ['/puttering'],
  documentationSection: () => ['/notes'],
  author: () => ['/journal'],
  project: () => ['/notes'],
}

export async function POST(request: NextRequest) {
  // Check request size
  if (isRequestTooLarge(request)) {
    return NextResponse.json(
      { message: 'Request too large' },
      { status: 413 }
    )
  }

  // Rate limit by IP
  const ip = getClientIP(request)
  const rateLimitResult = await checkRateLimit(ip)
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { message: 'Too many requests' },
      { status: 429, headers: createRateLimitHeaders(rateLimitResult) }
    )
  }

  const secret = request.headers.get('x-sanity-webhook-secret')
  const expectedSecret = process.env.SANITY_REVALIDATION_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { message: 'Revalidation secret not configured' },
      { status: 500 }
    )
  }

  const secretBuffer = Buffer.from(secret ?? '')
  const expectedBuffer = Buffer.from(expectedSecret)
  if (secretBuffer.length !== expectedBuffer.length || !timingSafeEqual(secretBuffer, expectedBuffer)) {
    return NextResponse.json(
      { message: 'Invalid webhook secret' },
      { status: 401 }
    )
  }

  let body: SanityWebhookPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON payload' },
      { status: 400 }
    )
  }

  const { _type, slug } = body

  // Validate _type against known types instead of reflecting raw input
  if (!VALID_TYPES.has(_type)) {
    return NextResponse.json(
      { message: 'No revalidation configured for this type' },
      { status: 200 }
    )
  }

  // Validate slug format
  const safeSlug = slug && SLUG_REGEX.test(slug) ? slug : undefined

  const getPathsFn = REVALIDATION_PATHS[_type]
  const paths = getPathsFn(safeSlug)
  paths.forEach((path) => revalidatePath(path))

  return NextResponse.json({
    revalidated: true,
    paths,
  })
}
