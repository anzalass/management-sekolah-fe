/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000'
      }
    ],
    domains: [
      'ik.imagekit.io',
      'static.vecteezy.com',
      'res.cloudinary.com',
      'storage.googleapis.com',
      'localhost',
      'images.pexels.com',
      'shanibacreative.com' // Add localhost to the domains list if needed
    ]
  },
  transpilePackages: ['geist'],

  // ✅ Skip TypeScript error saat build
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
