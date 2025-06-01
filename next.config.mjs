/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable standalone mode for Docker production builds
  output: 'standalone',
  // Optimize for containerized environments
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
}

export default nextConfig
