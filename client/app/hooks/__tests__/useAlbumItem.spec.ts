jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/app/constants/routes';
import { IAlbum } from '@/app/types/albums';

import { useActions } from '../useActions';
import useAlbumItem from '../useAlbumItem';
import useAuth from '../useAuth';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

describe('useAlbumItem', () => {
  const album: IAlbum = {
    _id: 'id1',
    name: 'A',
    author: 'B',
    picture: 'p.jpg',
  };
  const setActiveAlbum = jest.fn();
  const deleteAlbum = jest.fn();
  const push = jest.fn();
  const stopPropagation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ setActiveAlbum, deleteAlbum });
    mockedUseAuth.mockReturnValue({ isActivated: true });
    mockedUseRouter.mockReturnValue({ push });
  });

  it('exposes isActivated from useAuth', () => {
    const { result } = renderHook(() => useAlbumItem(album));

    expect(result.current.isActivated).toBe(true);
  });

  it('handleAlbumOpen sets the active album and navigates to tracks', () => {
    const { result } = renderHook(() => useAlbumItem(album));

    act(() => result.current.handleAlbumOpen());

    expect(setActiveAlbum).toHaveBeenCalledWith(album);
    expect(push).toHaveBeenCalledWith(ROUTES.TRACKS);
  });

  it('opens the delete confirmation and stops propagation', () => {
    const { result } = renderHook(() => useAlbumItem(album));

    act(() => {
      result.current.handleDeleteClick({ stopPropagation } as never);
    });

    expect(stopPropagation).toHaveBeenCalled();
    expect(result.current.isDeleteConfirmOpen).toBe(true);
  });

  it('handleDeleteCancel closes the confirmation without deleting', () => {
    const { result } = renderHook(() => useAlbumItem(album));

    act(() => {
      result.current.handleDeleteClick({ stopPropagation } as never);
    });
    act(() => result.current.handleDeleteCancel());

    expect(result.current.isDeleteConfirmOpen).toBe(false);
    expect(deleteAlbum).not.toHaveBeenCalled();
  });

  it('handleDeleteConfirm deletes the album and closes the confirmation', () => {
    const { result } = renderHook(() => useAlbumItem(album));

    act(() => {
      result.current.handleDeleteClick({ stopPropagation } as never);
    });
    act(() => result.current.handleDeleteConfirm());

    expect(deleteAlbum).toHaveBeenCalledWith('id1');
    expect(result.current.isDeleteConfirmOpen).toBe(false);
  });

  it('opens and closes the edit modal', () => {
    const { result } = renderHook(() => useAlbumItem(album));

    act(() => {
      result.current.handleEditOpen({ stopPropagation } as never);
    });
    expect(stopPropagation).toHaveBeenCalled();
    expect(result.current.isEditOpen).toBe(true);

    act(() => result.current.handleEditClose());
    expect(result.current.isEditOpen).toBe(false);
  });
});
