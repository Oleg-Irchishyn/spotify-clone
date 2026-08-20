import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TrackCreationForm from '../TrackCreationForm';

describe('TrackCreationForm', () => {
  const field = (value: string) => ({
    value,
    onChange: jest.fn(),
    reset: jest.fn(),
  });

  it('renders the name/artist/lyrics fields with their current values', () => {
    render(
      <TrackCreationForm
        name={field('Song')}
        artist={field('Artist')}
        text={field('Lyrics')}
        albumId=""
        onAlbumChange={jest.fn()}
        albums={[]}
      />,
    );

    expect(screen.getByLabelText(/Track Name/)).toHaveValue('Song');
    expect(screen.getByLabelText(/Track Artist/)).toHaveValue('Artist');
    expect(screen.getByLabelText(/Track Lyrics/)).toHaveValue('Lyrics');
  });

  it('renders "None" plus one option per album', async () => {
    const onAlbumChange = jest.fn();
    render(
      <TrackCreationForm
        name={field('')}
        artist={field('')}
        text={field('')}
        albumId=""
        onAlbumChange={onAlbumChange}
        albums={[{ _id: 'a1', name: 'Album 1', author: 'x', picture: 'p' }]}
      />,
    );

    await userEvent.click(screen.getByLabelText('Album'));
    expect(await screen.findByText('None')).toBeInTheDocument();
    expect(screen.getByText('Album 1')).toBeInTheDocument();

    await userEvent.click(screen.getByText('Album 1'));
    expect(onAlbumChange).toHaveBeenCalled();
  });

  it('calls onChange when typing in the name field', async () => {
    const onChange = jest.fn();
    render(
      <TrackCreationForm
        name={{ value: '', onChange, reset: jest.fn() }}
        artist={field('')}
        text={field('')}
        albumId=""
        onAlbumChange={jest.fn()}
        albums={[]}
      />,
    );

    await userEvent.type(screen.getByLabelText(/Track Name/), 'x');

    expect(onChange).toHaveBeenCalled();
  });
});
