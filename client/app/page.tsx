import type { Metadata } from 'next';

import HomeView from '@/app/components/HomeView/HomeView';

export const metadata: Metadata = {
  title: 'Music Platform',
  description: 'Music Platform. The best tracks are gathered here.',
};

export default function Home() {
  return <HomeView />;
}
