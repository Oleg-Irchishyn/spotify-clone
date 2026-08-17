import type { Metadata } from 'next';
import CreateTrackView from '@/app/components/CreateTrackView/CreateTrackView';

export const metadata: Metadata = {
  title: 'Upload Track - Music Platform',
  description: 'Upload a new track to Music Platform.',
};

export default function CreateTrackPage() {
  return <CreateTrackView />;
}
