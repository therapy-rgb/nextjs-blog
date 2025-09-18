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
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [touchEnd, setTouchEnd] = useState<{x: number, y: number} | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if user is on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const minSwipeDistance = 50;
    
    // Only register horizontal swipes if they're more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        nextPage(); // Swipe left = next page
      } else {
        prevPage(); // Swipe right = previous page
      }
    }
  };

  // Click to navigate (click left side = previous, right side = next)
  // Only enable click navigation on desktop to avoid conflicts with touch
  const handleImageClick = (e: React.MouseEvent) => {
    // Skip click navigation on mobile to prevent conflicts with touch events
    if (isMobile) return;
    
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
            className={`relative mb-6 group ${isMobile ? 'cursor-default' : 'cursor-pointer'}`}
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
              
              {/* Always Visible Navigation Arrows - Desktop and Mobile */}
              <>
                {/* Left Arrow */}
                <div 
                  onClick={(e) => { e.stopPropagation(); prevPage(); }}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-gray-300 text-gray-700 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer active:bg-gray-100 z-10 transition-all duration-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                
                {/* Right Arrow */}
                <div 
                  onClick={(e) => { e.stopPropagation(); nextPage(); }}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white border-2 border-gray-300 text-gray-700 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer active:bg-gray-100 z-10 transition-all duration-200"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </>
              
              {/* Navigation Hint - Always visible at bottom */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {isMobile ? '👆 Tap arrows or swipe' : '👆 Click arrows or use ← → keys'}
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
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={isTransitioning}
              className="flex items-center px-6 py-3 bg-sdm-primary text-white rounded-lg hover:bg-sdm-accent active:bg-sdm-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:shadow-md font-cooper min-w-[140px] justify-center"
            >
              <span className="mr-2">📖</span>
              Previous
            </button>

            {/* Page Indicators */}
            <div className="flex items-center gap-3">
              {poems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index)}
                  disabled={isTransitioning}
                  className={`${isMobile ? 'w-4 h-4' : 'w-3 h-3'} rounded-full transition-all duration-200 ${
                    index === currentPage 
                      ? 'bg-sdm-primary scale-125' 
                      : 'bg-warm-gray-300 hover:bg-warm-gray-400 active:bg-warm-gray-500'
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
              className="flex items-center px-6 py-3 bg-sdm-primary text-white rounded-lg hover:bg-sdm-accent active:bg-sdm-accent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:shadow-md font-cooper min-w-[140px] justify-center"
            >
              Next
              <span className="ml-2">📖</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-warm-gray-50 rounded-lg">
            <h3 className="font-display text-lg font-semibold text-sdm-text mb-2">How to Navigate</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-sdm-text-light font-cooper">
              {!isMobile && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">🖱️ Click:</span>
                    <span>Left side = Previous, Right side = Next</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">⌨️ Keys:</span>
                    <span>Arrow keys, A/D keys, or 1-9 for specific pages</span>
                  </div>
                </>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold">{isMobile ? '👆' : '📱'} {isMobile ? 'Touch' : 'Mobile'}:</span>
                <span>Swipe left/right to turn pages</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">🎯 Dots:</span>
                <span>{isMobile ? 'Tap' : 'Click'} page indicators to jump to any page</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">🔘 Buttons:</span>
                <span>Use Previous/Next buttons for navigation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
