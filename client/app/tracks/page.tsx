import type { Metadata } from 'next';
import TracksView from '@/app/components/TracksView/TracksView';

export const metadata: Metadata = {
  title: 'Tracklist - Music Platform',
  description: 'Browse the full list of tracks on Music Platform.',
};

export default function TracksPage() {
  return <TracksView />;
}
