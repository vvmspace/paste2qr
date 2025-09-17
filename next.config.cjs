/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable static generation
  output: 'export',
  distDir: 'dist',
  // Disable server-side features for static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/p/:alias',
        destination: '/published/:alias',
      },
    ]
  },
  // Generate static pages
  async generateStaticParams() {
    return [
      { slug: 'wifi-qr-code-generator' },
      { slug: 'phone-number-qr-code' },
      { slug: 'email-qr-code-generator' },
      { slug: 'sms-qr-code-maker' },
      { slug: 'contact-info-qr-code' },
    ]
  },
}

module.exports = nextConfig