'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Photo {
  src: string
  alt: string
  caption?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedPhoto(index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const nextPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto < photos.length - 1) {
      setSelectedPhoto(selectedPhoto + 1)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null && selectedPhoto > 0) {
      setSelectedPhoto(selectedPhoto - 1)
    }
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-lg bg-warm-gray-100 aspect-square"
            onClick={() => openLightbox(index)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />
            
            {/* Caption overlay on hover */}
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white text-sm font-cooper">{photo.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white hover:text-warm-gray-300 transition-colors"
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous button */}
            {selectedPhoto > 0 && (
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-warm-gray-300 transition-colors z-10"
                aria-label="Previous photo"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next button */}
            {selectedPhoto < photos.length - 1 && (
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-warm-gray-300 transition-colors z-10"
                aria-label="Next photo"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Main image */}
            <div className="relative w-full h-full max-w-3xl max-h-3xl">
              <Image
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
                unoptimized
              />
            </div>

            {/* Caption */}
            {photos[selectedPhoto].caption && (
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <p className="text-white text-lg font-cooper bg-black bg-opacity-50 rounded-lg px-4 py-2 inline-block">
                  {photos[selectedPhoto].caption}
                </p>
              </div>
            )}

            {/* Photo counter */}
            <div className="absolute top-4 left-4 text-white bg-black bg-opacity-50 rounded-lg px-3 py-1">
              <span className="text-sm font-cooper">
                {selectedPhoto + 1} of {photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}