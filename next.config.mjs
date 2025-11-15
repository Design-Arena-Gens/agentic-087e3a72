/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["agentic-087e3a72.vercel.app", "localhost:3000"],
    },
  },
};

export default nextConfig;
