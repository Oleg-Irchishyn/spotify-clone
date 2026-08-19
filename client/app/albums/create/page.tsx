import type { Metadata } from 'next';

import CreateAlbumView from '@/app/components/CreateAlbumView/CreateAlbumView';

export const metadata: Metadata = {
  title: 'Upload Album - Music Platform',
  description: 'Upload a new album to Music Platform.',
};

export default function CreateAlbumPage() {
  return <CreateAlbumView />;
}
