import Image from 'next/image'
import type { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { client, photoGalleryQuery, urlFor } from '@/lib/sanity'
import { PhotoGallery } from '@/types/sanity'
import { logError } from '@/lib/logging'

export const metadata: Metadata = {
  title: 'La Familia | Suburban Dad Mode',
  description: 'A gallery of precious family moments and memories from our suburban adventures.',
  alternates: {
    canonical: 'https://suburbandadmode.com/la-familia',
  },
  openGraph: {
    title: 'La Familia | Suburban Dad Mode',
    description: 'A gallery of precious family moments and memories from our suburban adventures.',
    url: 'https://suburbandadmode.com/la-familia',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'La Familia | Suburban Dad Mode',
    description: 'A gallery of precious family moments and memories from our suburban adventures.',
  },
}

export const revalidate = 3600

async function getGallery(): Promise<PhotoGallery | null> {
  try {
    return await client.fetch(photoGalleryQuery)
  } catch (error) {
    logError('sanity', 'Error fetching photo gallery', {
      error: error instanceof Error ? error.message : String(error),
    })
    return null
  }
}

export default async function LaFamilia() {
  const gallery = await getGallery()
  const photos = gallery?.photos ?? []

  return (
    <PageContainer maxWidth="6xl">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-6">
          La Familia
        </h1>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
        {photos.map((photo, index) => (
          <div
            key={photo._key}
            className="mb-4 sm:mb-6 break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <Image
              src={urlFor(photo).width(600).auto('format').url()}
              alt={photo.alt}
              width={600}
              height={0}
              loading={index < 3 ? 'eager' : 'lazy'}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </PageContainer>
  )
}
