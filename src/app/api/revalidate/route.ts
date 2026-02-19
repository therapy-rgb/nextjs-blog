import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

interface SanityWebhookPayload {
  _type: string
  slug?: string
}

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
  const secret = request.headers.get('x-sanity-webhook-secret')
  const expectedSecret = process.env.SANITY_REVALIDATION_SECRET

  if (!expectedSecret) {
    return NextResponse.json(
      { message: 'Revalidation secret not configured' },
      { status: 500 }
    )
  }

  if (secret !== expectedSecret) {
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
  const getPathsFn = REVALIDATION_PATHS[_type]

  if (!getPathsFn) {
    return NextResponse.json(
      { message: `No revalidation configured for type: ${_type}` },
      { status: 200 }
    )
  }

  const paths = getPathsFn(slug)
  paths.forEach((path) => revalidatePath(path))

  return NextResponse.json({
    revalidated: true,
    paths,
  })
}
