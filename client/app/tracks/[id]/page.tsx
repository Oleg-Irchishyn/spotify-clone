import type { Metadata } from 'next';
import { ITrack } from '@/app/types/tracks';
import TrackDetailsView from '@/app/components/TrackDetailsView/TrackDetailsView';

export async function generateMetadata(props: Readonly<PageProps<'/tracks/[id]'>>): Promise<Metadata> {
  const { id } = await props.params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tracks/${id}`);

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

export default async function TrackDetailsPage(props: Readonly<PageProps<'/tracks/[id]'>>) {
  const { id } = await props.params;

  return <TrackDetailsView id={id} />;
}
