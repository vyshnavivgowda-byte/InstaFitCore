/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "professionalhomeandofficeservice.water.blog",
      },
      {
        protocol: "https",
        hostname: "cleaningwithlove.ca",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      }
    ],
  },
};

module.exports = nextConfig;
