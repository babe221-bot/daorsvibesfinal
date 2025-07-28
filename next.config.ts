
import type {NextConfig} from 'next';

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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      }
    ],
  },
  experimental: {
    
  },
  allowedDevOrigins: [
    "https://3000-firebase-studio-1753398910481.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev",
    "http://127.0.0.1:4003",
    "https://3001-firebase-studio-1753398910481.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev",
    "https://4003-firebase-studio-1753398910481.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev"
  ],
};

export default nextConfig;
