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
      }
    ],
    domains: ['ik.imagekit.io'] // Tambahkan domain yang diperbolehkan
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
