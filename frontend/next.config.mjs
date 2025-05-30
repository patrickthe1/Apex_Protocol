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
  
  // Static export for Netlify deployment
  output: 'export',
  trailingSlash: true,
  
  // Add experimental features to handle SSR better
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  reactStrictMode: true,
}

export default nextConfig
