jest.mock('@/app/hooks/useTrackDetails', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import useTrackDetails from '@/app/hooks/useTrackDetails';

import TrackDetailsView from '../TrackDetailsView';

const mockedUseTrackDetails = useTrackDetails as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

const track = {
  _id: 'id1',
  name: 'Track name',
  artist: 'Track artist',
  text: 'Some lyrics',
  listens: 5,
  audio: 'audio.mp3',
  picture: 'picture.jpg',
  comments: [{ _id: 'c1', username: 'Alice', text: 'Nice track!' }],
};

const baseHook = {
  track,
  loading: false,
  username: { value: '', onChange: jest.fn(), reset: jest.fn() },
  commentText: { value: '', onChange: jest.fn(), reset: jest.fn() },
  handleAddComment: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseTrackDetails.mockReturnValue({ ...baseHook });
  mockedUseRouter.mockReturnValue({ back: jest.fn() });
});

describe('TrackDetailsView', () => {
  it('shows a full-screen loader while loading', () => {
    mockedUseTrackDetails.mockReturnValue({
      ...baseHook,
      track: undefined,
      loading: true,
    });

    const { container } = render(<TrackDetailsView id="id1" />);

    expect(container.querySelector('.MuiCircularProgress-root')).not.toBeNull();
  });

  it('renders nothing when not loading and there is no track', () => {
    mockedUseTrackDetails.mockReturnValue({
      ...baseHook,
      track: undefined,
      loading: false,
    });

    const { container } = render(<TrackDetailsView id="id1" />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the track name, artist, listens, and lyrics', () => {
    render(<TrackDetailsView id="id1" />);

    expect(screen.getByText('Track name')).toBeInTheDocument();
    expect(screen.getByText('Track artist')).toBeInTheDocument();
    expect(screen.getByText('5 listens')).toBeInTheDocument();
    expect(screen.getByText('Some lyrics')).toBeInTheDocument();
  });

  it('renders existing comments', () => {
    render(<TrackDetailsView id="id1" />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Nice track!')).toBeInTheDocument();
  });

  it('disables Send until both username and comment are filled', () => {
    render(<TrackDetailsView id="id1" />);

    expect(screen.getByRole('button', { name: /Send/ })).toBeDisabled();
  });

  it('enables Send and calls handleAddComment once both fields are filled', async () => {
    const handleAddComment = jest.fn();
    mockedUseTrackDetails.mockReturnValue({
      ...baseHook,
      username: { value: 'Bob', onChange: jest.fn(), reset: jest.fn() },
      commentText: { value: 'Great!', onChange: jest.fn(), reset: jest.fn() },
      handleAddComment,
    });

    render(<TrackDetailsView id="id1" />);
    const sendButton = screen.getByRole('button', { name: /Send/ });
    expect(sendButton).toBeEnabled();

    await userEvent.click(sendButton);

    expect(handleAddComment).toHaveBeenCalled();
  });

  it('keeps Send disabled when the fields are only whitespace', () => {
    mockedUseTrackDetails.mockReturnValue({
      ...baseHook,
      username: { value: '   ', onChange: jest.fn(), reset: jest.fn() },
      commentText: { value: '   ', onChange: jest.fn(), reset: jest.fn() },
    });

    render(<TrackDetailsView id="id1" />);

    expect(screen.getByRole('button', { name: /Send/ })).toBeDisabled();
  });
});
