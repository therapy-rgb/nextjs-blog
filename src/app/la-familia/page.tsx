import { Metadata } from 'next'
import PhotoGallery from '@/components/PhotoGallery'

export const metadata: Metadata = {
  title: 'La Familia | Suburban Dad Mode',
  description: 'A gallery of precious family moments and memories from our suburban adventures.',
}

const familyPhotos = [
  {
    src: '/familia-photos/IMG_5497.jpeg',
    alt: 'Family moment'
  },
  {
    src: '/familia-photos/IMG_0002.JPG',
    alt: 'Family adventure'
  },
  {
    src: '/familia-photos/IMG_2709.JPEG',
    alt: 'Family time'
  },
  {
    src: '/familia-photos/IMG_2615.jpg',
    alt: 'Family photo'
  },
  {
    src: '/familia-photos/IMG_2576.jpg',
    alt: 'Family moment'
  },
  {
    src: '/familia-photos/IMG_2697.jpg',
    alt: 'Family fun'
  },
  {
    src: '/familia-photos/IMG_2710.jpg',
    alt: 'Family time'
  },
  {
    src: '/familia-photos/IMG_2726.jpg',
    alt: 'Family adventure'
  },
  {
    src: '/familia-photos/IMG_5176.jpg',
    alt: 'Family moment'
  },
  {
    src: '/familia-photos/IMG_2482.jpg',
    alt: 'Family photo'
  },
  {
    src: '/familia-photos/133398442_45eyckutaz.jpg',
    alt: 'Family memory'
  },
  {
    src: '/familia-photos/133398442_t035lzatoz.jpg',
    alt: 'Family time'
  },
  {
    src: '/familia-photos/133398442_ukku9dpp4l.jpg',
    alt: 'Family fun'
  },
  {
    src: '/familia-photos/133398442_y3pva1zxxb.jpg',
    alt: 'Family moment'
  },
  {
    src: '/familia-photos/133398442_zw2ypx3k75.jpg',
    alt: 'Family adventure'
  }
]

export default function LaFamilia() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-6">
          La Familia
        </h1>
      </div>
      
      <div className="bg-sdm-card rounded-lg p-6 sm:p-8 shadow-sm border border-warm-gray-200">
        <PhotoGallery photos={familyPhotos} />
      </div>
    </div>
  )
}