const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
})

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
  // i18n configuration
  i18n: {
    locales: ['en', 'es', 'zh', 'fr', 'am', 'pt'],
    defaultLocale: 'en',
    localeDetection: true,
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
    ]
  },
}

module.exports = withPWA(nextConfig)