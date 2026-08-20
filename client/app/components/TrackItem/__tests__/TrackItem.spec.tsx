jest.mock('@/app/hooks/useTrack', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useTrack from '@/app/hooks/useTrack';
import { ITrack } from '@/app/types/tracks';

import TrackItem from '../TrackItem';

const mockedUseTrack = useTrack as unknown as jest.Mock;

const track: ITrack = {
  _id: 'id1',
  name: 'Track name',
  artist: 'Track artist',
  text: '',
  listens: 0,
  audio: 'http://localhost:5000/audio/1.mp3',
  picture: 'http://localhost:5000/image/1.jpg',
  comments: [],
};

const baseHook = {
  handleTrackDetailsRedirect: jest.fn(),
  handlePlay: jest.fn(),
  isActivated: false,
  isActive: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  loop: false,
  handleToggleLoop: jest.fn(),
  isDeleteConfirmOpen: false,
  handleDeleteClick: jest.fn(),
  handleDeleteCancel: jest.fn(),
  handleDeleteConfirm: jest.fn(),
  isEditOpen: false,
  handleEditOpen: jest.fn(),
  handleEditClose: jest.fn(),
};

beforeAll(() => {
  (global as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseTrack.mockReturnValue({ ...baseHook });
});

describe('TrackItem', () => {
  it('renders the track name and artist', () => {
    render(<TrackItem track={track} />);

    expect(screen.getByText('Track name')).toBeInTheDocument();
    expect(screen.getByText('Track artist')).toBeInTheDocument();
  });

  it('shows the play icon when not playing', () => {
    render(<TrackItem track={track} />);

    expect(screen.getByTestId('PlayArrowIcon')).toBeInTheDocument();
  });

  it('shows the pause icon when playing', () => {
    mockedUseTrack.mockReturnValue({ ...baseHook, isPlaying: true });

    render(<TrackItem track={track} />);

    expect(screen.getByTestId('PauseIcon')).toBeInTheDocument();
  });

  it('shows the duration only when the track is active', () => {
    const { rerender } = render(<TrackItem track={track} />);
    expect(screen.queryByText('0:00 / 0:00')).not.toBeInTheDocument();

    mockedUseTrack.mockReturnValue({
      ...baseHook,
      isActive: true,
      currentTime: 5,
      duration: 65,
    });
    rerender(<TrackItem track={track} />);

    expect(screen.getByText('0:05 / 1:05')).toBeInTheDocument();
  });

  it('hides edit/delete controls when not activated', () => {
    render(<TrackItem track={track} />);

    expect(screen.queryByLabelText('edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
  });

  it('shows edit/delete controls when activated', () => {
    mockedUseTrack.mockReturnValue({ ...baseHook, isActivated: true });

    render(<TrackItem track={track} />);

    expect(screen.getByLabelText('edit')).toBeInTheDocument();
    expect(screen.getByLabelText('delete')).toBeInTheDocument();
  });

  it('disables the repeat button when the track is not active', () => {
    render(<TrackItem track={track} />);

    expect(screen.getByLabelText('repeat')).toBeDisabled();
  });

  it('enables the repeat button when the track is active', () => {
    mockedUseTrack.mockReturnValue({ ...baseHook, isActive: true });

    render(<TrackItem track={track} />);

    expect(screen.getByLabelText('repeat')).toBeEnabled();
  });

  it('calls handlePlay, handleToggleLoop, and handleTrackDetailsRedirect', async () => {
    const handlePlay = jest.fn();
    const handleToggleLoop = jest.fn();
    const handleTrackDetailsRedirect = jest.fn();
    mockedUseTrack.mockReturnValue({
      ...baseHook,
      isActive: true,
      handlePlay,
      handleToggleLoop,
      handleTrackDetailsRedirect,
    });

    render(<TrackItem track={track} />);
    await userEvent.click(screen.getByTestId('PlayArrowIcon'));
    await userEvent.click(screen.getByLabelText('repeat'));
    await userEvent.click(screen.getByText('Track name'));

    expect(handlePlay).toHaveBeenCalled();
    expect(handleToggleLoop).toHaveBeenCalled();
    expect(handleTrackDetailsRedirect).toHaveBeenCalled();
  });

  it('shows the delete confirmation dialog when isDeleteConfirmOpen is true', () => {
    mockedUseTrack.mockReturnValue({
      ...baseHook,
      isActivated: true,
      isDeleteConfirmOpen: true,
    });

    render(<TrackItem track={track} />);

    expect(screen.getByText('Delete track')).toBeInTheDocument();
  });
});
