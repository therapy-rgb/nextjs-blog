import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false,
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
    // Security headers applied to all routes
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://cdn.sanity.io",
          "font-src 'self' data:",
          "connect-src 'self' https://*.sanity.io https://*.sentry.io https://*.ingest.sentry.io",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
      },
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains; preload',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
    ];

    return [
      // Apply security headers to all routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
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

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
});
