import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/results/:path*',
        destination: '/:path*', // This is a bit of a hack to serve static files from the results dir
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // This is to prevent a build error with curlconverter
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};

export default nextConfig;
