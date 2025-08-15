/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        'fs': 'false',
      },
    },
  },
  resolve: {
    alias: {
      'fs': 'false',
    },
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
