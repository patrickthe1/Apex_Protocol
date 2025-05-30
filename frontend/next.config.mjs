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
  
  async rewrites() {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const backendUrl = isDevelopment 
      ? 'http://localhost:8080'
      : process.env.NEXT_PUBLIC_BACKEND_URL || 'https://apex-protocol-backend.onrender.com';
      
    return [
      {
        source: '/api/:path*', // Match any path starting with /api/
        destination: `${backendUrl}/api/:path*`, // Proxy to your backend
      },
    ];
  },
}

export default nextConfig
