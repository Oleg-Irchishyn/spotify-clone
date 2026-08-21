jest.mock('../../TrackItem/TrackItem', () => ({
  __esModule: true,
  default: ({ track }: { track: { _id: string; name: string } }) => (
    <div data-testid="track-item">{track.name}</div>
  ),
}));
jest.mock('../../TrackItemSkeleton/TrackItemSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="track-skeleton" />,
}));

import { render, screen } from '@testing-library/react';

import { ITrack } from '@/app/types/tracks';

import TrackList from '../TrackList';

const tracks: ITrack[] = [
  {
    _id: '1',
    name: 'A',
    artist: 'x',
    text: '',
    listens: 0,
    audio: 'a.mp3',
    picture: 'p.jpg',
    comments: [],
  },
];

describe('TrackList', () => {
  it('renders one item per track when not loading', () => {
    render(<TrackList tracks={tracks} loading={false} />);

    expect(screen.getAllByTestId('track-item')).toHaveLength(1);
  });

  it('renders a single skeleton placeholder while loading with no known tracks yet', () => {
    render(<TrackList tracks={[]} loading />);

    expect(screen.getAllByTestId('track-skeleton')).toHaveLength(1);
    expect(screen.queryByTestId('track-item')).not.toBeInTheDocument();
  });

  it('renders as many skeletons as the previously known tracks while loading', () => {
    render(<TrackList tracks={[...tracks, ...tracks, ...tracks]} loading />);

    expect(screen.getAllByTestId('track-skeleton')).toHaveLength(3);
  });
});
