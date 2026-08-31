/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Static export enabled for Hostinger shared hosting
  output: 'export',
  trailingSlash: true,
  // distDir: 'dist',
}

export default nextConfig
