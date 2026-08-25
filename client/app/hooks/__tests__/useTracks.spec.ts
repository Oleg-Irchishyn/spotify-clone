jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';

import { PAGE_SIZE } from '@/app/constants/pagination';
import { ROUTES } from '@/app/constants/routes';

import { useActions } from '../useActions';
import useAuth from '../useAuth';
import useTracks from '../useTracks';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as unknown as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

describe('useTracks', () => {
  const fetchTracks = jest.fn();
  const searchTracks = jest.fn();
  const resolveActiveAlbum = jest.fn();
  const setActiveAlbum = jest.fn();
  const push = jest.fn();
  let state: {
    tracks: {
      tracks: unknown[];
      totalCount: number;
      loading: boolean;
      error: string;
    };
    albums: {
      activeAlbum: { _id: string } | null;
      activeAlbumResolved: boolean;
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    state = {
      tracks: { tracks: [], totalCount: 9, loading: false, error: '' },
      albums: { activeAlbum: null, activeAlbumResolved: false },
    };
    mockedUseActions.mockReturnValue({
      fetchTracks,
      searchTracks,
      resolveActiveAlbum,
      setActiveAlbum,
    });
    mockedUseAuth.mockReturnValue({ isActivated: true });
    mockedUseTypedSelector.mockImplementation((selector) => selector(state));
    mockedUseRouter.mockReturnValue({ push });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('resolves the active album on mount when not yet resolved', () => {
    renderHook(() => useTracks());

    expect(resolveActiveAlbum).toHaveBeenCalled();
    expect(fetchTracks).not.toHaveBeenCalled();
  });

  it('fetches tracks once the active album is resolved', () => {
    state.albums.activeAlbumResolved = true;

    renderHook(() => useTracks());

    expect(fetchTracks).toHaveBeenCalledWith(PAGE_SIZE, 0, undefined);
  });

  it('scopes fetchTracks to the active album id when one is set', () => {
    state.albums.activeAlbumResolved = true;
    state.albums.activeAlbum = { _id: 'album1' };

    renderHook(() => useTracks());

    expect(fetchTracks).toHaveBeenCalledWith(PAGE_SIZE, 0, 'album1');
  });

  it('does not re-resolve the active album once already resolved', () => {
    state.albums.activeAlbumResolved = true;

    renderHook(() => useTracks());

    expect(resolveActiveAlbum).not.toHaveBeenCalled();
  });

  it('exposes isActivated and the active album', () => {
    state.albums.activeAlbumResolved = true;
    state.albums.activeAlbum = { _id: 'album1' };

    const { result } = renderHook(() => useTracks());

    expect(result.current.isActivated).toBe(true);
    expect(result.current.activeAlbum).toEqual({ _id: 'album1' });
  });

  it('handleClearActiveAlbum clears the album and resets the page', () => {
    state.albums.activeAlbumResolved = true;
    const { result } = renderHook(() => useTracks());

    act(() => result.current.handleClearActiveAlbum());

    expect(setActiveAlbum).toHaveBeenCalledWith(null);
    expect(result.current.page).toBe(1);
  });

  it('handleTrackUpload navigates to the track upload route', () => {
    state.albums.activeAlbumResolved = true;
    const { result } = renderHook(() => useTracks());

    act(() => result.current.handleTrackUpload());

    expect(push).toHaveBeenCalledWith(ROUTES.TRACK_UPLOAD);
  });

  it('debounces search and calls searchTracks instead of fetchTracks once a query is set', () => {
    state.albums.activeAlbumResolved = true;
    const { result } = renderHook(() => useTracks());
    fetchTracks.mockClear();

    act(() => {
      result.current.handleSearch({ target: { value: 'query' } } as never);
    });
    expect(searchTracks).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.page).toBe(1);
    expect(searchTracks).toHaveBeenCalledWith('query', PAGE_SIZE, 0, undefined);
  });

  it('computes pageCount from totalCount, with a floor of 1', () => {
    state.albums.activeAlbumResolved = true;
    const { result } = renderHook(() => useTracks());

    expect(result.current.pageCount).toBe(Math.ceil(9 / PAGE_SIZE));
  });

  it('handlePageChange updates the page', () => {
    state.albums.activeAlbumResolved = true;
    const { result } = renderHook(() => useTracks());

    act(() => {
      result.current.handlePageChange({} as never, 2);
    });

    expect(result.current.page).toBe(2);
  });

  it('steps back to the last valid page when the current page is emptied out', () => {
    state.albums.activeAlbumResolved = true;
    state.tracks.totalCount = 9;
    const { result, rerender } = renderHook(() => useTracks());

    act(() => {
      result.current.handlePageChange({} as never, 3);
    });
    expect(result.current.page).toBe(3);
    fetchTracks.mockClear();

    // Deleting the last tracks on page 3 drops totalCount below what page 3
    // needs, mirroring what the DELETE_TRACK reducer does synchronously.
    state.tracks.totalCount = 8;
    rerender();

    expect(result.current.page).toBe(2);
    expect(fetchTracks).toHaveBeenCalledWith(PAGE_SIZE, PAGE_SIZE, undefined);
  });
});
