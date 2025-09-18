'use client';

import { useState } from 'react';

export default function FaviconDebug() {
  const [, setTimestamp] = useState(Date.now());

  const refreshFavicons = () => {
    const newTimestamp = Date.now();
    setTimestamp(newTimestamp);

    // Force refresh all favicon-related elements
    const faviconElements = document.querySelectorAll('link[rel*="icon"]');
    faviconElements.forEach((element) => {
      const link = element as HTMLLinkElement;
      const url = new URL(link.href);
      url.searchParams.set('_t', newTimestamp.toString());
      link.href = url.toString();
    });

    // Force refresh manifest
    const manifestElement = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestElement) {
      const url = new URL(manifestElement.href);
      url.searchParams.set('_t', newTimestamp.toString());
      manifestElement.href = url.toString();
    }

    console.log('Favicons refreshed with timestamp:', newTimestamp);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={refreshFavicons}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
        title="Force refresh favicons (for testing)"
      >
        🔄 Refresh Favicons
      </button>
    </div>
  );
}