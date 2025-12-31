/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: './',     // This is the fix for the white screen
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;