import type { NextConfig } from "next";

const screeningBackend = 'https://the-monarch-report-seven.vercel.app';
const hasScreeningEnvironment = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL
  && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  && process.env.SUPABASE_SECRET_KEY,
);

const nextConfig: NextConfig = {
  // monarchreport.org is hosted on a separate Vercel project without the
  // Supabase environment, so /screening is proxied here (rewrites below).
  // The proxied HTML must load its JS/CSS from THIS deployment — chunks whose
  // content differs between the two builds (Turbopack runtime, env-dependent
  // modules) do not exist on the proxying host and 404 there, which kills
  // hydration and leaves the screening room without a play control.
  assetPrefix: hasScreeningEnvironment ? screeningBackend : undefined,
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
