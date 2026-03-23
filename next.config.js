/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  allowedDevOrigins: [
    'https://3000-firebase-daorsvibesfinal2-1755200532526.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev',
    'https://3001-firebase-daorsvibesfinal2-1755200532526.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev'
  ],
  experimental: {
  },
  turbopack: {},
  // Webpack configuration for aliasing 'fs' to an empty module
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
