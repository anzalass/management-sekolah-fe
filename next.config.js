// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development' // disable saat dev
// });

// module.exports = withPWA({
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'utfs.io', port: '' },
//       { protocol: 'https', hostname: 'api.slingacademy.com', port: '' },
//       { protocol: 'http', hostname: 'localhost', port: '5000' },
//       {
//         protocol: 'https',
//         hostname: 'api.yayasantunasanakmulia.sch.id',
//         port: ''
//       }
//     ],
//     domains: [
//       'ik.imagekit.io',
//       'static.vecteezy.com',
//       'res.cloudinary.com',
//       'storage.googleapis.com',
//       'localhost',
//       'api.yayasantunasanakmulia.sch.id',
//       'ui-avatars.com',
//       'via.placeholder.com',
//       'static.wikia.nocookie.net'
//     ]
//   },

//   transpilePackages: ['geist'],
//   typescript: { ignoreBuildErrors: true },
//   eslint: { ignoreDuringBuilds: true },

//   async redirects() {
//     return [
//       {
//         source: '/:path*',
//         has: [{ type: 'host', value: 'www.yayasantunasanakmulia.sch.id' }],
//         destination: 'https://yayasantunasanakmulia.sch.id/:path*',
//         permanent: true
//       }
//     ];
//   },

//   // 🔥 Tambahin CSP header disini
//   async headers() {
//     return [
//       {
//         source: '/(.*)', // semua route
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value: `
//             default-src 'self';
//             script-src 'self' 'unsafe-eval' 'unsafe-inline'
//               https://snap-assets.al-pc-id-b.cdn.gtflabs.io
//               https://api.sandbox.midtrans.com
//               https://app.sandbox.midtrans.com
//               https://pay.google.com
//               https://js-agent.newrelic.com
//               https://bam.nr-data.net;
//             frame-src 'self' https://app.sandbox.midtrans.com https://api.sandbox.midtrans.com;
//             connect-src 'self' https://management-sekolah.zeabur.app https://api.sandbox.midtrans.com https://app.sandbox.midtrans.com;
//             img-src * data: blob:;
//             style-src 'self' 'unsafe-inline';
//           `.replace(/\s{2,}/g, ' ')
//           }
//         ]
//       }
//     ];
//   }
// });
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
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
      'https://ytam-be.zeabur.app',
      'https://ytam-be2.zeabur.app',
      'https://api.sandbox.midtrans.com',
      'https://app.sandbox.midtrans.com',
      'https://generativelanguage.googleapis.com',
      'https://*.googleapis.com',
      'https://www.google-analytics.com',

      ...(isDev ? ['http://localhost:5000'] : [])
    ].join(' ');

    const frameSrc = [
      "'self'",
      'https://app.sandbox.midtrans.com',
      'https://api.sandbox.midtrans.com',
      'https://docs.google.com',
      'https://forms.gle',
      'https://ytam-be.zeabur.app',
      'https://ytam-be2.zeabur.app',
      'https://*.google.com',
      'https://*.gstatic.com',
      'https://*.googleusercontent.com',
      ...(isDev ? ['http://localhost:5000'] : [])
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
              connect-src ${connectSrc} data: blob:;
              img-src * data: blob:;
              style-src 'self' 'unsafe-inline';
              frame-src ${frameSrc};
              frame-ancestors 'self' self' https://*;
            `.replace(/\s{2,}/g, ' ')
          }
        ]
      }
    ];
  }
});
