jest.mock('@/app/hooks/useAlbums', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/app/components/AlbumList/AlbumList', () => ({
  __esModule: true,
  default: ({ albums }: { albums: unknown[] }) => (
    <div data-testid="album-list">{albums.length} albums</div>
  ),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import useAlbums from '@/app/hooks/useAlbums';

import AlbumsView from '../AlbumsView';

const mockedUseAlbums = useAlbums as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

const baseHook = {
  albums: [{ _id: '1', name: 'A', author: 'x', picture: 'p' }],
  loading: false,
  error: '',
  isActivated: false,
  handleAlbumUpload: jest.fn(),
  query: '',
  handleSearch: jest.fn(),
  page: 1,
  pageCount: 1,
  handlePageChange: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseAlbums.mockReturnValue({ ...baseHook });
  mockedUseRouter.mockReturnValue({ back: jest.fn() });
});

describe('AlbumsView', () => {
  it('renders the album list when albums are present', () => {
    render(<AlbumsView />);

    expect(screen.getByTestId('album-list')).toHaveTextContent('1 albums');
    expect(screen.queryByText('No albums found.')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no albums', () => {
    mockedUseAlbums.mockReturnValue({ ...baseHook, albums: [] });

    render(<AlbumsView />);

    expect(screen.getByText('No albums found.')).toBeInTheDocument();
  });

  it('shows the empty state when there is an error, even with albums present', () => {
    mockedUseAlbums.mockReturnValue({ ...baseHook, error: 'Server error' });

    render(<AlbumsView />);

    expect(screen.getByText('No albums found.')).toBeInTheDocument();
  });

  it('hides the Upload button when not activated', () => {
    render(<AlbumsView />);

    expect(
      screen.queryByRole('button', { name: 'Upload' }),
    ).not.toBeInTheDocument();
  });

  it('shows the Upload button when activated and calls handleAlbumUpload', async () => {
    const handleAlbumUpload = jest.fn();
    mockedUseAlbums.mockReturnValue({
      ...baseHook,
      isActivated: true,
      handleAlbumUpload,
    });

    render(<AlbumsView />);
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));

    expect(handleAlbumUpload).toHaveBeenCalled();
  });

  it('still shows the Upload button when activated and showing the empty state', () => {
    mockedUseAlbums.mockReturnValue({
      ...baseHook,
      isActivated: true,
      albums: [],
    });

    render(<AlbumsView />);

    expect(
      screen.getByRole('button', { name: 'Upload' }),
    ).toBeInTheDocument();
  });
});
