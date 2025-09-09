import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'La Familia | Suburban Dad Mode',
  description: 'A gallery of precious family moments and memories from our suburban adventures.',
}

export default function LaFamilia() {
  const photos = [
    '133398442_45eyckutaz.jpg',
    '133398442_t035lzatoz.jpg', 
    '133398442_ukku9dpp4l.jpg',
    '133398442_y3pva1zxxb.jpg',
    '133398442_zw2ypx3k75.jpg',
    'IMG_0002.JPG',
    'IMG_2482.jpg',
    'IMG_2576.jpg',
    'IMG_2615.jpg',
    'IMG_2697.jpg',
    'IMG_2709.JPEG',
    'IMG_2710.jpg',
    'IMG_2726.jpg',
    'IMG_5176.jpg',
    'IMG_5497.jpeg'
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-6">
          La Familia
        </h1>
      </div>
      
      <div className="bg-sdm-card rounded-lg p-6 sm:p-8 shadow-sm border border-warm-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square overflow-hidden rounded-lg bg-warm-gray-100">
              <img
                src={`/familia-photos/${photo}`}
                alt={`Family photo ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}