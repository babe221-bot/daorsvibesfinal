/** @type {import('next').NextConfig} */
const nextConfig = {
  // your existing next config
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '3000-firebase-studio-1753398910481.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev', '9000-firebase-daorsvibesfinalgit-1754936710940.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev', '3001-firebase-daorsvibesfinalgit-1754936710940.cluster-fbfjltn375c6wqxlhoehbz44sk.cloudworkstations.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'muzika--strumflow.europe-west4.hosted.app',
      },
    ],
  },
};

module.exports = nextConfig;
