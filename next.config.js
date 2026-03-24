/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  turbopack: {
    resolveAlias: {
      fs: {
        browser: './empty-module.js',
      },
      path: {
        browser: './empty-module.js',
      },
    },
  },
  allowedDevOrigins: [
    'https://3000-firebase-daorsvibesfinal2-1755200532526.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev',
    'https://3001-firebase-daorsvibesfinal2-1755200532526.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev'
  ],
  serverExternalPackages: ['aubiojs'],
  experimental: {
  },
};

module.exports = withBundleAnalyzer(nextConfig);
