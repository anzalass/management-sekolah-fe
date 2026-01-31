const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,

  // 🔥 INI KUNCINYA
  importScripts: ['/push-sw.js']
});

const isDev = process.env.NODE_ENV === 'development';

module.exports = withPWA({
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io', port: '' },
      { protocol: 'https', hostname: 'api.slingacademy.com', port: '' },
      { protocol: 'http', hostname: 'localhost', port: '5000' },
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
  eslint: { ignoreDuringBuilds: true },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.yayasantunasanakmulia.sch.id' }],
        destination: 'https://yayasantunasanakmulia.sch.id/:path*',
        permanent: true
      }
    ];
  },

  async headers() {
    const connectSrc = [
      "'self'",
      'https://management-sekolah.zeabur.app',
      'https://little-alley.zeabur.app',
      'https://ytam-be.zeabur.app',
      'https://ytam-be2.zeabur.app',
      'https://api.sandbox.midtrans.com',
      'https://app.sandbox.midtrans.com',
      'https://generativelanguage.googleapis.com',
      'https://www.googleapis.com',
      'https://www.google-analytics.com',
      'http://localhost:5000', // 🔥 FIX UTAMA
      'data:',
      'blob:',
      ...(process.env.NODE_ENV === 'development'
        ? ['http://localhost:5000']
        : [])
    ].join(' ');

    const frameSrc = [
      "'self'",
      'https://app.sandbox.midtrans.com',
      'https://api.sandbox.midtrans.com',
      'https://docs.google.com',
      'https://forms.gle',
      'https://little-alley.zeabur.app',
      'https://ytam-be.zeabur.app',
      'https://ytam-be2.zeabur.app'
    ].join(' ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline'
      https://snap-assets.al-pc-id-b.cdn.gtflabs.io
      https://api.sandbox.midtrans.com
      https://app.sandbox.midtrans.com
      https://pay.google.com
      https://js-agent.newrelic.com
      https://bam.nr-data.net;
    worker-src 'self' blob:;
    service-worker-src 'self';
    connect-src ${connectSrc};
    img-src * data: blob:;
    style-src 'self' 'unsafe-inline';
    frame-src ${frameSrc};
  `.replace(/\s{2,}/g, ' ')
          }
        ]
      }
    ];
  }
});
