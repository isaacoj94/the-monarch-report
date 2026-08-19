import type { NextConfig } from "next";

const screeningBackend = 'https://the-monarch-report-seven.vercel.app';
const hasScreeningEnvironment = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL
  && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  && process.env.SUPABASE_SECRET_KEY,
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pbs.twimg.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/documentary', destination: '/films', permanent: true },
      { source: '/documentary/:path*', destination: '/films/:path*', permanent: true },
    ];
  },
  async rewrites() {
    if (hasScreeningEnvironment) return [];

    return {
      beforeFiles: [
        {
          source: '/screening',
          destination: `${screeningBackend}/screening`,
        },
        {
          source: '/screening/:path+',
          destination: `${screeningBackend}/screening/:path+`,
        },
        {
          source: '/api/screening/:path+',
          destination: `${screeningBackend}/api/screening/:path+`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
