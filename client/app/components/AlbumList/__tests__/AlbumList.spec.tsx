jest.mock('../../AlbumItem/AlbumItem', () => ({
  __esModule: true,
  default: ({ album }: { album: { _id: string; name: string } }) => (
    <div data-testid="album-item">{album.name}</div>
  ),
}));
jest.mock('../../AlbumItemSkeleton/AlbumItemSkeleton', () => ({
  __esModule: true,
  default: () => <div data-testid="album-skeleton" />,
}));

import { render, screen } from '@testing-library/react';

import { IAlbum } from '@/app/types/albums';

import AlbumList from '../AlbumList';

const albums: IAlbum[] = [
  { _id: '1', name: 'A', author: 'x', picture: 'p' },
  { _id: '2', name: 'B', author: 'y', picture: 'p' },
];

describe('AlbumList', () => {
  it('renders one item per album when not loading', () => {
    render(<AlbumList albums={albums} loading={false} />);

    expect(screen.getAllByTestId('album-item')).toHaveLength(2);
  });

  it('renders skeleton placeholders while loading', () => {
    render(<AlbumList albums={[]} loading />);

    expect(screen.getAllByTestId('album-skeleton').length).toBeGreaterThan(0);
    expect(screen.queryByTestId('album-item')).not.toBeInTheDocument();
  });
});
