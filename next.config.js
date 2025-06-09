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
        protocol: 'http', // Ensure you're allowing HTTP for localhost
        hostname: 'localhost', // Add localhost as a valid source
        port: '5000' // Specify the port where the image server is running
      }
    ],
    domains: [
      'ik.imagekit.io',
      'static.vecteezy.com',
      'res.cloudinary.com',
      'storage.googleapis.com',
      'localhost' // Add localhost to the domains list if needed
    ]
  },
  transpilePackages: ['geist']
};

module.exports = nextConfig;
