'use client'

import Image from 'next/image'
import { PageContainer } from '@/components/layout'


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
    'travel babu.jpg',
    'dog-04.jpg',
    'dog-05.jpg'
  ]

  return (
    <PageContainer maxWidth="6xl">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-6">
          La Familia
        </h1>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6">
        {photos.map((photo, index) => (
          <div key={index} className="mb-4 sm:mb-6 break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <Image
              src={`/familia-photos/${photo.replace(/\.(jpg|jpeg)$/i, '.webp')}`}
              alt={`Family photo ${index + 1}`}
              width={600}
              height={0}
              loading={index < 3 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-auto hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </PageContainer>
  )
}