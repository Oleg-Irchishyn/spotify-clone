jest.mock('@/app/hooks/useEditTrack', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useEditTrack from '@/app/hooks/useEditTrack';
import { ITrack } from '@/app/types/tracks';

import EditTrackForm from '../EditTrackForm';

const mockedUseEditTrack = useEditTrack as unknown as jest.Mock;

const track: ITrack = {
  _id: 'id1',
  name: 'Track',
  artist: 'Artist',
  text: 'Lyrics',
  listens: 0,
  audio: 'audio.mp3',
  picture: 'picture.jpg',
  comments: [],
};

const baseHook = {
  name: { value: 'Track', onChange: jest.fn(), reset: jest.fn() },
  artist: { value: 'Artist', onChange: jest.fn(), reset: jest.fn() },
  text: { value: 'Lyrics', onChange: jest.fn(), reset: jest.fn() },
  picture: undefined,
  setPicture: jest.fn(),
  audio: undefined,
  setAudio: jest.fn(),
  albumId: '',
  handleAlbumChange: jest.fn(),
  albums: [{ _id: 'album1', name: 'Album 1', author: 'x', picture: 'p' }],
  isDirty: false,
  handleSubmit: jest.fn(),
};

describe('EditTrackForm', () => {
  it('renders the track fields with current values', () => {
    mockedUseEditTrack.mockReturnValue({ ...baseHook });

    render(<EditTrackForm track={track} onClose={jest.fn()} />);

    expect(screen.getByLabelText(/Track Name/)).toHaveValue('Track');
    expect(screen.getByLabelText(/Track Artist/)).toHaveValue('Artist');
    expect(screen.getByLabelText(/Track Lyrics/)).toHaveValue('Lyrics');
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('renders the album options', async () => {
    mockedUseEditTrack.mockReturnValue({ ...baseHook });

    render(<EditTrackForm track={track} onClose={jest.fn()} />);
    await userEvent.click(screen.getByLabelText('Album'));

    expect(await screen.findByText('Album 1')).toBeInTheDocument();
  });

  it('enables Save when dirty and calls onClose from Cancel', async () => {
    const onClose = jest.fn();
    mockedUseEditTrack.mockReturnValue({ ...baseHook, isDirty: true });

    render(<EditTrackForm track={track} onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });
});
