import type { NextConfig } from 'next';

import { BASE_PATH } from './app/constants/basePath';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: 'export',
    basePath: BASE_PATH,
    trailingSlash: true,
  }),
  images: isGithubPages
    ? { unoptimized: true }
    : {
        dangerouslyAllowLocalIP: true,
        qualities: [75, 90],
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'localhost',
            port: '5000',
            pathname: '/**',
          },
          // Dev typically points at the same database as production, whose
          // tracks/albums may carry Cloudflare R2 URLs from prod uploads.
          {
            protocol: 'https',
            hostname: '**.r2.dev',
            pathname: '/**',
          },
        ],
      },
};

export default nextConfig;
