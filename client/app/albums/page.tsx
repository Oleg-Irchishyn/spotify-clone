import type { Metadata } from 'next';

import AlbumsView from '@/app/components/AlbumsView/AlbumsView';

export const metadata: Metadata = {
  title: 'Album lists - Music Platform',
  description: 'Browse the full list of albums on Music Platform.',
};

export default function AlbumsPage() {
  return <AlbumsView />;
}
