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
