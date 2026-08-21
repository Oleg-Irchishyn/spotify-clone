'use client';

import { useSearchParams } from 'next/navigation';

import TrackDetailsView from './TrackDetailsView';

const TrackDetailsContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') ?? '';

  return <TrackDetailsView id={id} key={id} />;
};

export default TrackDetailsContent;
