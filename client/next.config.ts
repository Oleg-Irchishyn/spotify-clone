import type { NextConfig } from 'next';

import { BASE_PATH } from './app/constants/basePath';

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: 'export',
    basePath: BASE_PATH,
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
        ],
      },
};

export default nextConfig;
