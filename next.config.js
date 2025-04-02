/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for image optimization
  reactStrictMode: false,
  
  // Simplified image configuration
  images: {
    formats: ['image/avif', 'image/webp'],
  }
}

module.exports = nextConfig
