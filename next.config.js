/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode for image optimization
  reactStrictMode: false,
  
  output: 'export', // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig
