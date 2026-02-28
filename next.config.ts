import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs';

const isDev = process.env.NODE_ENV === 'development';

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
          isDev
            ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
            : "script-src 'self' 'sha256-48mwFFjK43z3EoJptu/mGBvcDGMtixXg3mRoZNpHPRQ='",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https://cdn.sanity.io",
          "font-src 'self' data:",
          "connect-src 'self' https://*.sanity.io https://*.sentry.io https://*.ingest.sentry.io https://api.open-meteo.com",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "object-src 'none'",
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
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
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
      // Favicon cache busting — short-lived cache to prevent stale favicons
      {
        source: '/:path(favicon.ico|favicon.svg|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|icon-192.png|icon-512.png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, no-cache, must-revalidate',
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
      // Old /posts/:slug → /journal/:slug (URL redesign)
      {
        source: '/posts/:slug',
        destination: '/journal/:slug',
        permanent: true,
      },
      // Old /documentation → /notes (URL redesign)
      {
        source: '/documentation',
        destination: '/notes',
        permanent: true,
      },
      // WordPress category redirects → journal (no /categories/ route exists)
      {
        source: '/category/:slug*',
        destination: '/journal',
        permanent: true,
      },
      {
        source: '/categories/:slug*',
        destination: '/journal',
        permanent: true,
      },
      // Projects moved into Notes page
      {
        source: '/projects',
        destination: '/notes?section=projects',
        permanent: true,
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
