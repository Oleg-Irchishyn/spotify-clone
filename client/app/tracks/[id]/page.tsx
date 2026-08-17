import type { Metadata } from 'next';

import TrackDetailsView from '@/app/components/TrackDetailsView/TrackDetailsView';
import { ITrack } from '@/app/types/tracks';

export async function generateMetadata(
  props: Readonly<PageProps<'/tracks/[id]'>>,
): Promise<Metadata> {
  const { id } = await props.params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/tracks/${id}`,
    );

    if (!response.ok) {
      return { title: 'Track not found - Music Platform' };
    }

    const track: ITrack = await response.json();

    return {
      title: `Music Platform - ${track.name} - ${track.artist}`,
      description: track.text,
    };
  } catch {
    return { title: 'Music Platform' };
  }
}

export default async function TrackDetailsPage(
  props: Readonly<PageProps<'/tracks/[id]'>>,
) {
  const { id } = await props.params;

  return <TrackDetailsView id={id} />;
}
