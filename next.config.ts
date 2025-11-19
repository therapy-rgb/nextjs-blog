import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['src'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // Favicon cache busting for mobile browsers
      {
        source: '/:path(favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|icon-192.png|icon-512.png)',
        headers: [
          {
            key: 'Cache-Control',
            value: process.env.NODE_ENV === 'development'
              ? 'no-cache, no-store, must-revalidate'
              : 'public, max-age=3600, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // Site manifest cache control
      {
        source: '/site.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // WordPress category redirects
      {
        source: '/category/finances',
        destination: '/categories/finances',
        permanent: true
      },
      {
        source: '/category/finances/page/:page',
        destination: '/categories/finances?page=:page',
        permanent: true
      },
      {
        source: '/category/junk-drawer',
        destination: '/categories/junk-drawer',
        permanent: true
      },
      {
        source: '/category/junk-drawer/page/:page',
        destination: '/categories/junk-drawer?page=:page',
        permanent: true
      },
      {
        source: '/category/la-familia',
        destination: '/categories/la-familia',
        permanent: true
      },
      {
        source: '/category/la-familia/page/:page',
        destination: '/categories/la-familia?page=:page',
        permanent: true
      },
      {
        source: '/category/music',
        destination: '/categories/music',
        permanent: true
      },
      {
        source: '/category/music/page/:page',
        destination: '/categories/music?page=:page',
        permanent: true
      },
      {
        source: '/category/news',
        destination: '/categories/news',
        permanent: true
      },
      {
        source: '/category/news/page/:page',
        destination: '/categories/news?page=:page',
        permanent: true
      },
      {
        source: '/category/today',
        destination: '/categories/today',
        permanent: true
      },
      {
        source: '/category/today/page/:page',
        destination: '/categories/today?page=:page',
        permanent: true
      },
      {
        source: '/category/uncategorized',
        destination: '/categories/uncategorized',
        permanent: true
      },
      {
        source: '/category/uncategorized/page/:page',
        destination: '/categories/uncategorized?page=:page',
        permanent: true
      },
      {
        source: '/category/wisdom',
        destination: '/categories/wisdom',
        permanent: true
      },
      {
        source: '/category/wisdom/page/:page',
        destination: '/categories/wisdom?page=:page',
        permanent: true
      },
      {
        source: '/category/:slug*',
        destination: '/categories/:slug*',
        permanent: true
      },
      // WWW redirect
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.suburbandadmode.com',
          },
        ],
        destination: 'https://suburbandadmode.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
