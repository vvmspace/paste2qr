/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // i18n configuration removed - using App Router
  async rewrites() {
    return [
      {
        source: '/p/:alias',
        destination: '/published/:alias',
      },
    ]
  },
}

module.exports = nextConfig