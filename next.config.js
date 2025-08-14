/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // your existing next config
  webpack: (config, { isServer, dev }) => {
    config.output.publicPath = '/_next/';
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '3000-firebase-studio-1753398910481.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev', '9000-firebase-daorsvibesfinalgit-1754936710940.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev', '3001-firebase-daorsvibesfinalgit-1754936710940.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev', '3000-firebase-daorsvibesfinal2-1755200532526.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev', '3001-firebase-daorsvibesfinal2-1755200532526.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'muzika--strumflow.europe-west4.hosted.app',
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
