'use client'

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Puttering() {
  const poems = [
    {
      src: "/quick-sheets.png",
      alt: "Quick Sheets - Page 1",
      title: "Quick Sheets"
    },
    {
      src: "/quick-sheets-2.png",
      alt: "Quick Sheets - Page 2",
      title: "Quick Sheets"
    }
  ];

  const [currentPage, setCurrentPage] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentPage(prev => prev > 0 ? prev - 1 : poems.length - 1);
      } else if (e.key === 'ArrowRight') {
        setCurrentPage(prev => prev < poems.length - 1 ? prev + 1 : 0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [poems.length]);

  const nextPage = () => {
    setCurrentPage(prev => prev < poems.length - 1 ? prev + 1 : 0);
  };

  const prevPage = () => {
    setCurrentPage(prev => prev > 0 ? prev - 1 : poems.length - 1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-8">
          Puttering
        </h1>
        
        {/* Book Interface */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          {/* Current Page */}
          <div className="relative mb-6">
            <Image
              src={poems[currentPage].src}
              alt={poems[currentPage].alt}
              width={600}
              height={450}
              className="mx-auto rounded-lg shadow-md"
              priority
              quality={95}
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={prevPage}
              className="flex items-center px-4 py-2 bg-sdm-primary text-white rounded-lg hover:bg-sdm-accent transition-colors duration-200"
            >
              <span className="mr-2">←</span>
              Previous
            </button>

            <div className="font-cooper text-sdm-text-light">
              Page {currentPage + 1} of {poems.length}
            </div>

            <button
              onClick={nextPage}
              className="flex items-center px-4 py-2 bg-sdm-primary text-white rounded-lg hover:bg-sdm-accent transition-colors duration-200"
            >
              Next
              <span className="ml-2">→</span>
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="text-sm text-sdm-text-light mt-4 font-cooper">
            Use arrow keys to navigate
          </p>
        </div>
      </div>
    </div>
  );
}
