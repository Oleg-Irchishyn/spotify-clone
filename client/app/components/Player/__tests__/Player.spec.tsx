jest.mock('@/app/hooks/usePlayer', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import usePlayer from '@/app/hooks/usePlayer';
import { ITrack } from '@/app/types/tracks';

import Player from '../Player';

const mockedUsePlayer = usePlayer as unknown as jest.Mock;

const track: ITrack = {
  _id: 'id1',
  name: 'Track name',
  artist: 'Track artist',
  text: '',
  listens: 0,
  audio: 'audio.mp3',
  picture: 'picture.jpg',
  comments: [],
};

const baseHook = {
  pause: true,
  active: track,
  progress: 30,
  duration: 180,
  hanlePlay: jest.fn(),
  handleProgressChange: jest.fn(),
  volume: 80,
  handleVolumeChange: jest.fn(),
};

beforeAll(() => {
  (global as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockedUsePlayer.mockReturnValue({ ...baseHook });
});

describe('Player', () => {
  it('renders nothing when there is no active track', () => {
    mockedUsePlayer.mockReturnValue({ ...baseHook, active: null });

    const { container } = render(<Player />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the active track name and artist', () => {
    render(<Player />);

    expect(screen.getByText('Track name')).toBeInTheDocument();
    expect(screen.getByText('Track artist')).toBeInTheDocument();
  });

  it('shows the play icon when paused', () => {
    render(<Player />);

    expect(screen.getByTestId('PlayArrowIcon')).toBeInTheDocument();
  });

  it('shows the pause icon when playing', () => {
    mockedUsePlayer.mockReturnValue({ ...baseHook, pause: false });

    render(<Player />);

    expect(screen.getByTestId('PauseIcon')).toBeInTheDocument();
  });

  it('calls hanlePlay when the play/pause button is clicked', async () => {
    const hanlePlay = jest.fn();
    mockedUsePlayer.mockReturnValue({ ...baseHook, hanlePlay });

    render(<Player />);
    await userEvent.click(
      screen.getByTestId('PlayArrowIcon').closest('button')!,
    );

    expect(hanlePlay).toHaveBeenCalled();
  });

  it('renders the formatted progress and raw volume labels', () => {
    render(<Player />);

    expect(screen.getByText('0:30 / 3:00')).toBeInTheDocument();
    expect(screen.getByText('80 / 100')).toBeInTheDocument();
  });

  it('restricts the volume slider to whole-number steps', () => {
    render(<Player />);

    const [progressSlider, volumeSlider] = screen.getAllByRole('slider');

    expect(progressSlider).toHaveAttribute('step', 'any');
    expect(volumeSlider).toHaveAttribute('step', '1');
  });
});
