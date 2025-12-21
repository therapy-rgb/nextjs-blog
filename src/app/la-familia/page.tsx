'use client'

import Image from 'next/image'

export default function LaFamilia() {
  const photos = [
    '133398442_zw2ypx3k75.jpg',
    'IMG_2576.jpg',
    'IMG_2697.jpg',
    'IMG_2724.jpg',
    'IMG_2726.jpg',
    'IMG_2731.jpg',
    'IMG_2766.jpg',
    'IMG_2772.jpg',
    'IMG_2773.jpg',
    'IMG_2775.jpg',
    'IMG_2902.jpg',
    'IMG_5073.jpg',
    'IMG_5075.jpg',
    'IMG_5149.jpg',
    'IMG_5190.jpg',
    'IMG_5230.jpg',
    'IMG_5244.jpg',
    'IMG_5269.jpg',
    'IMG_5304.jpg',
    'IMG_5312.jpg',
    'IMG_5478.jpg',
    'IMG_5489.jpg',
    'IMG_5495.jpg',
    'IMG_5668.jpg',
    'travel babu.jpg'
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