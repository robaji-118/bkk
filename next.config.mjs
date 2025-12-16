/** @type {import('next').NextConfig} */
const nextConfig = {
  // Abaikan error ESLint (any, prefer-const, dll) saat build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Abaikan error TypeScript saat build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;