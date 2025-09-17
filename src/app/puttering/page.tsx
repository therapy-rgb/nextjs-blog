'use client'

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Poem configuration - easily add new poems here
const poems = [
  {
    src: "/quick-sheets.png",
    alt: "Quick Sheets - Page 1",
    title: "Quick Sheets",
    description: "First page of Quick Sheets"
  },
  {
    src: "/quick-sheets-2.png",
    alt: "Quick Sheets - Page 2",
    title: "Quick Sheets",
    description: "Second page of Quick Sheets"
  }
  // To add more poems, simply add new objects here:
  // {
  //   src: "/new-poem.png",
  //   alt: "New Poem Description",
  //   title: "New Poem Title",
  //   description: "Brief description of the poem"
  // }
];

export default function Puttering() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Page navigation functions
  const nextPage = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(prev => (prev + 1) % poems.length);
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning]);

  const prevPage = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(prev => (prev - 1 + poems.length) % poems.length);
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning]);

  const goToPage = useCallback((pageIndex: number) => {
    if (isTransitioning || pageIndex === currentPage) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(pageIndex);
      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent navigation if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        nextPage();
      } else if (e.key >= '1' && e.key <= '9') {
        const pageNum = parseInt(e.key) - 1;
        if (pageNum < poems.length) {
          e.preventDefault();
          goToPage(pageNum);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, goToPage]);

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPage();
    } else if (isRightSwipe) {
      prevPage();
    }
  };

  // Click to navigate (click left side = previous, right side = next)
  const handleImageClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    if (x < width / 2) {
      prevPage();
    } else {
      nextPage();
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-sdm-text mb-8">
          Puttering
        </h1>
        
        {/* Book Interface */}
        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 mb-6 border border-warm-gray-200">
          {/* Current Page with Book-like Presentation */}
          <div 
            className="relative mb-6 cursor-pointer group"
            onClick={handleImageClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Page Shadow Effect */}
            <div className="absolute inset-0 bg-warm-gray-300 rounded-lg transform translate-x-1 translate-y-1 -z-10"></div>
            
            {/* Main Image */}
            <div className={`relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}>
              <Image
                src={poems[currentPage].src}
                alt={poems[currentPage].alt}
                width={800}
                height={600}
                className="mx-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
                priority
                quality={95}
                style={{ 
                  width: 'auto', 
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '70vh'
                }}
              />
              
              {/* Hover Overlay Instructions */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-between px-8 rounded-lg">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold bg-black bg-opacity-50 px-3 py-1 rounded">
                  ← Previous
                </div>
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold bg-black bg-opacity-50 px-3 py-1 rounded">
                  Next →
                </div>
              </div>
            </div>
          </div>

          {/* Page Title */}
          <h2 className="font-display text-2xl font-bold text-sdm-text mb-2">
            {poems[currentPage].title}
          </h2>
          <p className="text-sdm-text-light font-cooper mb-6">
            {poems[currentPage].description}
          </p>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={isTransitioning}
              className="flex items-center px-6 py-3 bg-sdm-primary text-white rounded-lg hover:bg-sdm-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-cooper"
            >
              <span className="mr-2">📖</span>
              Previous Page
            </button>

            {/* Page Indicators */}
            <div className="flex items-center gap-2">
              {poems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  disabled={isTransitioning}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentPage 
                      ? 'bg-sdm-primary scale-125' 
                      : 'bg-warm-gray-300 hover:bg-warm-gray-400'
                  } disabled:cursor-not-allowed`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Page Counter */}
            <div className="font-cooper text-sdm-text-light text-center sm:min-w-0">
              <div className="text-lg font-semibold">
                {currentPage + 1} / {poems.length}
              </div>
            </div>

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={isTransitioning}
              className="flex items-center px-6 py-3 bg-sdm-primary text-white rounded-lg hover:bg-sdm-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-cooper"
            >
              Next Page
              <span className="ml-2">📖</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-warm-gray-50 rounded-lg">
            <h3 className="font-display text-lg font-semibold text-sdm-text mb-2">How to Navigate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-sdm-text-light font-cooper">
              <div className="flex items-center gap-2">
                <span className="font-semibold">🖱️ Click:</span>
                <span>Left side = Previous, Right side = Next</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">⌨️ Keys:</span>
                <span>Arrow keys, A/D keys, or 1-9 for specific pages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">📱 Mobile:</span>
                <span>Swipe left/right to turn pages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">🎯 Dots:</span>
                <span>Click page indicators to jump to any page</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
