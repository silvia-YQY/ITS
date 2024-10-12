/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Proxy all requests to /api/* to the target API
        destination: `${process.env.API_URL}/api/:path*`, // Use the API_URL from .env.local
      },
    ];
  },
};

export default nextConfig;
