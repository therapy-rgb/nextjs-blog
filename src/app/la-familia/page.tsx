import { Metadata } from 'next'
import PhotoGallery from '@/components/PhotoGallery'

export const metadata: Metadata = {
  title: 'La Familia | Suburban Dad Mode',
  description: 'A gallery of precious family moments and memories from our suburban adventures.',
}

const familyPhotos = [
  {
    src: '/familia-photos/IMG_5497.jpeg',
    alt: 'Family moment',
    caption: 'Creating memories together'
  },
  {
    src: '/familia-photos/IMG_0002.JPG',
    alt: 'Family adventure',
    caption: 'Another day, another adventure'
  },
  {
    src: '/familia-photos/IMG_2709.JPEG',
    alt: 'Family time',
    caption: 'Precious moments'
  },
  {
    src: '/familia-photos/IMG_2615.jpg',
    alt: 'Family photo',
    caption: 'Making memories'
  },
  {
    src: '/familia-photos/IMG_2576.jpg',
    alt: 'Family moment',
    caption: 'Together is our favorite place'
  },
  {
    src: '/familia-photos/IMG_2697.jpg',
    alt: 'Family fun',
    caption: 'Life is better with family'
  },
  {
    src: '/familia-photos/IMG_2710.jpg',
    alt: 'Family time',
    caption: 'Simple joys'
  },
  {
    src: '/familia-photos/IMG_2726.jpg',
    alt: 'Family adventure',
    caption: 'Adventures together'
  },
  {
    src: '/familia-photos/IMG_5176.jpg',
    alt: 'Family moment',
    caption: 'Love and laughter'
  },
  {
    src: '/familia-photos/IMG_2482.jpg',
    alt: 'Family photo',
    caption: 'Our beautiful chaos'
  },
  {
    src: '/familia-photos/133398442_45eyckutaz.jpg',
    alt: 'Family memory',
    caption: 'Cherished moments'
  },
  {
    src: '/familia-photos/133398442_t035lzatoz.jpg',
    alt: 'Family time',
    caption: 'Growing up together'
  },
  {
    src: '/familia-photos/133398442_ukku9dpp4l.jpg',
    alt: 'Family fun',
    caption: 'Joy in the little things'
  },
  {
    src: '/familia-photos/133398442_y3pva1zxxb.jpg',
    alt: 'Family moment',
    caption: 'Home is where the family is'
  },
  {
    src: '/familia-photos/133398442_zw2ypx3k75.jpg',
    alt: 'Family adventure',
    caption: 'Making the most of every day'
  }
]

export default function LaFamilia() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-6">
          La Familia
        </h1>
        <p className="text-xl text-sdm-text-light font-cooper max-w-3xl mx-auto">
          Welcome to our family gallery! These are the moments that matter most – 
          the everyday adventures, special occasions, and candid snapshots that tell the story 
          of our suburban family life.
        </p>
      </div>
      
      <div className="bg-sdm-card rounded-lg p-6 sm:p-8 shadow-sm border border-warm-gray-200">
        <PhotoGallery photos={familyPhotos} />
      </div>
      
      <div className="mt-12 bg-warm-gray-50 rounded-lg p-6 text-center">
        <p className="text-sdm-text-light font-cooper">
          Click on any photo to view it larger. Use the arrow keys or buttons to navigate through the gallery.
        </p>
      </div>
    </div>
  )
}