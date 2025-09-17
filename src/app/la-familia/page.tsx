'use client'

import Image from 'next/image'

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
        <div className="flex flex-col gap-4 sm:gap-6">
          {photos.map((photo, index) => (
            <div key={index} className="w-full max-w-md mx-auto rounded-lg overflow-hidden bg-warm-gray-100">
              <Image
                src={`/familia-photos/${photo}`}
                alt={`Family photo ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}