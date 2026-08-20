jest.mock('@/app/hooks/useAlbumItem', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useAlbumItem from '@/app/hooks/useAlbumItem';
import { IAlbum } from '@/app/types/albums';

import AlbumItem from '../AlbumItem';

const mockedUseAlbumItem = useAlbumItem as unknown as jest.Mock;

const album: IAlbum = {
  _id: 'id1',
  name: 'Album name',
  author: 'Album author',
  picture: 'http://localhost:5000/image/1.jpg',
};

const baseHook = {
  handleAlbumOpen: jest.fn(),
  isActivated: false,
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
  mockedUseAlbumItem.mockReturnValue({ ...baseHook });
});

describe('AlbumItem', () => {
  it('renders the album name and author', () => {
    render(<AlbumItem album={album} />);

    expect(screen.getByText('Album name')).toBeInTheDocument();
    expect(screen.getByText('Album author')).toBeInTheDocument();
  });

  it('hides edit/delete controls when not activated', () => {
    render(<AlbumItem album={album} />);

    expect(screen.queryByLabelText('edit')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
  });

  it('shows edit/delete controls when activated', () => {
    mockedUseAlbumItem.mockReturnValue({ ...baseHook, isActivated: true });

    render(<AlbumItem album={album} />);

    expect(screen.getByLabelText('edit')).toBeInTheDocument();
    expect(screen.getByLabelText('delete')).toBeInTheDocument();
  });

  it('calls handleAlbumOpen when the card is clicked', async () => {
    const handleAlbumOpen = jest.fn();
    mockedUseAlbumItem.mockReturnValue({ ...baseHook, handleAlbumOpen });

    render(<AlbumItem album={album} />);
    await userEvent.click(screen.getByText('Album name'));

    expect(handleAlbumOpen).toHaveBeenCalled();
  });

  it('calls handleEditOpen and handleDeleteClick from their buttons', async () => {
    const handleEditOpen = jest.fn();
    const handleDeleteClick = jest.fn();
    mockedUseAlbumItem.mockReturnValue({
      ...baseHook,
      isActivated: true,
      handleEditOpen,
      handleDeleteClick,
    });

    render(<AlbumItem album={album} />);
    await userEvent.click(screen.getByLabelText('edit'));
    await userEvent.click(screen.getByLabelText('delete'));

    expect(handleEditOpen).toHaveBeenCalled();
    expect(handleDeleteClick).toHaveBeenCalled();
  });

  it('shows the delete confirmation dialog when isDeleteConfirmOpen is true', () => {
    mockedUseAlbumItem.mockReturnValue({
      ...baseHook,
      isActivated: true,
      isDeleteConfirmOpen: true,
    });

    render(<AlbumItem album={album} />);

    expect(screen.getByText('Delete album')).toBeInTheDocument();
  });
});
