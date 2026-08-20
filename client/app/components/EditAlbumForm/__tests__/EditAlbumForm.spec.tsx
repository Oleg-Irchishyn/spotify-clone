jest.mock('@/app/hooks/useEditAlbum', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useEditAlbum from '@/app/hooks/useEditAlbum';
import { IAlbum } from '@/app/types/albums';

import EditAlbumForm from '../EditAlbumForm';

const mockedUseEditAlbum = useEditAlbum as unknown as jest.Mock;

const album: IAlbum = { _id: 'id1', name: 'A', author: 'B', picture: 'p.jpg' };

describe('EditAlbumForm', () => {
  it('renders the name/author fields with current values and a disabled Save when not dirty', () => {
    mockedUseEditAlbum.mockReturnValue({
      name: { value: 'A', onChange: jest.fn(), reset: jest.fn() },
      author: { value: 'B', onChange: jest.fn(), reset: jest.fn() },
      picture: undefined,
      setPicture: jest.fn(),
      isDirty: false,
      handleSubmit: jest.fn(),
    });

    render(<EditAlbumForm album={album} onClose={jest.fn()} />);

    expect(screen.getByLabelText(/Album Name/)).toHaveValue('A');
    expect(screen.getByLabelText(/Album Author/)).toHaveValue('B');
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('enables Save when dirty and calls onClose from Cancel', async () => {
    const onClose = jest.fn();
    mockedUseEditAlbum.mockReturnValue({
      name: { value: 'A', onChange: jest.fn(), reset: jest.fn() },
      author: { value: 'B', onChange: jest.fn(), reset: jest.fn() },
      picture: undefined,
      setPicture: jest.fn(),
      isDirty: true,
      handleSubmit: jest.fn(),
    });

    render(<EditAlbumForm album={album} onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });
});
