const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' // disable saat dev
});

module.exports = withPWA({
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
      },
      {
        protocol: 'https',
        hostname: 'api.yayasantunasanakmulia.sch.id',
        port: ''
      }
    ],
    domains: [
      'ik.imagekit.io',
      'static.vecteezy.com',
      'res.cloudinary.com',
      'storage.googleapis.com',
      'localhost',
      'api.yayasantunasanakmulia.sch.id',
      'ui-avatars.com',
      'via.placeholder.com',
      'static.wikia.nocookie.net'
    ]
  },

  transpilePackages: ['geist'],

  typescript: { ignoreBuildErrors: true },
  eslint: {
    ignoreDuringBuilds: true
  }
});
