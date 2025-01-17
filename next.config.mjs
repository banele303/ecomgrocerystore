/** @type {import('next').NextConfig} */
const nextConfig = {



  images: {
    domains: ['static.wixstatic.com'], // Add Wix image domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wixstatic.com',
      },
    ],
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "people.pic1.co",
      },
      {
        protocol: "https",
        hostname: "app-uploads-cdn.fera.ai",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
};

export default nextConfig;