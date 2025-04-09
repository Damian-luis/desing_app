/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'cvnmmwtalfhmuebkrjta.supabase.co'],
  },
}

module.exports = nextConfig