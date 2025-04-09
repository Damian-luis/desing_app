/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    //removeConsole: true,
    //removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'cvnmmwtalfhmuebkrjta.supabase.co'],
  },
  /*logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  },*/
}

module.exports = nextConfig