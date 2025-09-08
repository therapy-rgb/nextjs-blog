import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    dirs: ['src'],
  },
  async redirects() {
    return [
      // Redirect www to non-www
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
    ]
  },
};

export default nextConfig;
