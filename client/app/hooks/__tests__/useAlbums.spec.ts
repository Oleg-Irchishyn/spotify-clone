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
import useAlbums from '../useAlbums';
import useAuth from '../useAuth';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as unknown as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

describe('useAlbums', () => {
  const fetchAlbums = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockedUseActions.mockReturnValue({ fetchAlbums });
    mockedUseAuth.mockReturnValue({ isActivated: true });
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({
        albums: { albums: [], totalCount: 9, loading: false, error: '' },
      }),
    );
    mockedUseRouter.mockReturnValue({ push });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('fetches the first page on mount', () => {
    renderHook(() => useAlbums());

    expect(fetchAlbums).toHaveBeenCalledWith('', PAGE_SIZE, 0);
  });

  it('exposes isActivated from useAuth', () => {
    const { result } = renderHook(() => useAlbums());

    expect(result.current.isActivated).toBe(true);
  });

  it('computes pageCount from totalCount, with a floor of 1', () => {
    const { result } = renderHook(() => useAlbums());

    expect(result.current.pageCount).toBe(Math.ceil(9 / PAGE_SIZE));
  });

  it('pageCount floors at 1 when there are no results', () => {
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({
        albums: { albums: [], totalCount: 0, loading: false, error: '' },
      }),
    );

    const { result } = renderHook(() => useAlbums());

    expect(result.current.pageCount).toBe(1);
  });

  it('handleAlbumUpload navigates to the album upload route', () => {
    const { result } = renderHook(() => useAlbums());

    act(() => result.current.handleAlbumUpload());

    expect(push).toHaveBeenCalledWith(ROUTES.ALBUM_UPLOAD);
  });

  it('handlePageChange updates the page and refetches with the new offset', () => {
    const { result } = renderHook(() => useAlbums());
    fetchAlbums.mockClear();

    act(() => {
      result.current.handlePageChange({} as never, 2);
    });

    expect(result.current.page).toBe(2);
    expect(fetchAlbums).toHaveBeenCalledWith('', PAGE_SIZE, PAGE_SIZE);
  });

  it('debounces search input, resets to page 1, and refetches with the query', () => {
    const { result } = renderHook(() => useAlbums());

    act(() => {
      result.current.handlePageChange({} as never, 2);
    });
    fetchAlbums.mockClear();

    act(() => {
      result.current.handleSearch({
        target: { value: 'query' },
      } as never);
    });
    expect(result.current.query).toBe('query');
    expect(fetchAlbums).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current.page).toBe(1);
    expect(fetchAlbums).toHaveBeenCalledWith('query', PAGE_SIZE, 0);
  });

  it('clears a pending debounce timer when searching again quickly', () => {
    const { result } = renderHook(() => useAlbums());
    fetchAlbums.mockClear();

    act(() => {
      result.current.handleSearch({ target: { value: 'a' } } as never);
    });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    act(() => {
      result.current.handleSearch({ target: { value: 'ab' } } as never);
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(fetchAlbums).toHaveBeenCalledTimes(1);
    expect(fetchAlbums).toHaveBeenCalledWith('ab', PAGE_SIZE, 0);
  });
});
