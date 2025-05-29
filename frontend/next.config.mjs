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
  
  // Add experimental features to handle SSR better
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  reactStrictMode: true, 
  
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match any path starting with /api/
        destination: 'http://localhost:8080/api/:path*', // Proxy to your backend
      },
    ];
  },
}

export default nextConfig
