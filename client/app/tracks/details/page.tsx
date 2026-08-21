import type { Metadata } from 'next';
import { Suspense } from 'react';

import Loader from '@/app/components/Loader/Loader';
import TrackDetailsContent from '@/app/components/TrackDetailsView/TrackDetailsContent';

export const metadata: Metadata = {
  title: 'Music Platform - Track details',
};

export default function TrackDetailsPage() {
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <TrackDetailsContent />
    </Suspense>
  );
}
