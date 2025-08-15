/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // Turbopack configuration for aliasing 'fs' to an empty module
  experimental: {
    turbo: {
      resolveAlias: {
        'fs': './empty-module.js',
      },
    },
  },
  // Webpack configuration for aliasing 'fs' to an empty module
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
