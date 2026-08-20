jest.mock('@/app/hooks/useTracks', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/app/components/TrackList/TrackList', () => ({
  __esModule: true,
  default: ({ tracks }: { tracks: unknown[] }) => (
    <div data-testid="track-list">{tracks.length} tracks</div>
  ),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import useTracks from '@/app/hooks/useTracks';

import TracksView from '../TracksView';

const mockedUseTracks = useTracks as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

const baseHook = {
  tracks: [{ _id: '1', name: 'A' }],
  loading: false,
  error: '',
  isActivated: false,
  handleTrackUpload: jest.fn(),
  query: '',
  handleSearch: jest.fn(),
  page: 1,
  pageCount: 1,
  handlePageChange: jest.fn(),
  activeAlbum: null,
  handleClearActiveAlbum: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseTracks.mockReturnValue({ ...baseHook });
  mockedUseRouter.mockReturnValue({ back: jest.fn() });
});

describe('TracksView', () => {
  it('renders the track list when tracks are present', () => {
    render(<TracksView />);

    expect(screen.getByTestId('track-list')).toHaveTextContent('1 tracks');
    expect(screen.queryByText('No tracks found.')).not.toBeInTheDocument();
  });

  it('shows the empty state when there are no tracks', () => {
    mockedUseTracks.mockReturnValue({ ...baseHook, tracks: [] });

    render(<TracksView />);

    expect(screen.getByText('No tracks found.')).toBeInTheDocument();
  });

  it('hides the Upload button when not activated', () => {
    render(<TracksView />);

    expect(
      screen.queryByRole('button', { name: 'Upload' }),
    ).not.toBeInTheDocument();
  });

  it('shows the Upload button when activated and calls handleTrackUpload', async () => {
    const handleTrackUpload = jest.fn();
    mockedUseTracks.mockReturnValue({
      ...baseHook,
      isActivated: true,
      handleTrackUpload,
    });

    render(<TracksView />);
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));

    expect(handleTrackUpload).toHaveBeenCalled();
  });

  it('does not show the active album chip when there is no active album', () => {
    render(<TracksView />);

    expect(screen.queryByText(/^Album:/)).not.toBeInTheDocument();
  });

  it('shows the active album chip and clears it on delete', async () => {
    const handleClearActiveAlbum = jest.fn();
    mockedUseTracks.mockReturnValue({
      ...baseHook,
      activeAlbum: { _id: 'a1', name: 'My Album' },
      handleClearActiveAlbum,
    });

    render(<TracksView />);
    expect(screen.getByText('Album: My Album')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('CancelIcon'));

    expect(handleClearActiveAlbum).toHaveBeenCalled();
  });
});
