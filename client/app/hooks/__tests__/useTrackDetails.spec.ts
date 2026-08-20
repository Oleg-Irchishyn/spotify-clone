jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/app/lib/http', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

import { act, renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { ChangeEvent } from 'react';

import $api from '@/app/lib/http';

import { useActions } from '../useActions';
import useAuth from '../useAuth';
import useTrackDetails from '../useTrackDetails';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as jest.Mock;
const mockedApi = $api as jest.Mocked<typeof $api>;

const trackResponse = {
  _id: 'id1',
  name: 'Track',
  artist: 'Artist',
  text: '',
  listens: 0,
  audio: 'audio.mp3',
  picture: 'picture.jpg',
  comments: [],
};

describe('useTrackDetails', () => {
  const showAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ showAlert });
    mockedUseAuth.mockReturnValue({
      user: null,
      isActivated: false,
      loading: false,
    });
  });

  it('starts in a loading state with no track', () => {
    mockedApi.get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useTrackDetails('id1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.track).toBeUndefined();
  });

  it('loads the track and resolves picture/audio asset urls', async () => {
    mockedApi.get.mockResolvedValue({ data: trackResponse });

    const { result } = renderHook(() => useTrackDetails('id1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(mockedApi.get).toHaveBeenCalledWith('/tracks/id1', {
      signal: expect.any(AbortSignal),
    });
    expect(result.current.track?.picture).toContain('picture.jpg');
    expect(result.current.track?.audio).toContain('audio.mp3');
  });

  it('shows an alert and stops loading on a genuine fetch failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network fail'));

    const { result } = renderHook(() => useTrackDetails('id1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(showAlert).toHaveBeenCalledWith('Network fail');
  });

  it('falls back to a generic message for non-Error fetch failures', async () => {
    mockedApi.get.mockRejectedValue('nope');

    const { result } = renderHook(() => useTrackDetails('id1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(showAlert).toHaveBeenCalledWith('Server error');
  });

  it('does not show an alert when the request was cancelled', async () => {
    mockedApi.get.mockRejectedValue(new axios.CanceledError());

    const { result } = renderHook(() => useTrackDetails('id1'));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(showAlert).not.toHaveBeenCalled();
  });

  it('aborts the in-flight request and does not update state after unmount', async () => {
    let rejectRequest: (reason: unknown) => void = () => {};
    mockedApi.get.mockReturnValue(
      new Promise((_resolve, reject) => {
        rejectRequest = reject;
      }),
    );

    const { result, unmount } = renderHook(() => useTrackDetails('id1'));
    expect(result.current.loading).toBe(true);

    unmount();

    await act(async () => {
      rejectRequest(new axios.CanceledError());
      await Promise.resolve();
    });

    expect(showAlert).not.toHaveBeenCalled();
  });

  it('handleAddComment does nothing when the track has not loaded yet', async () => {
    mockedApi.get.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useTrackDetails('id1'));

    await act(async () => {
      await result.current.handleAddComment();
    });

    expect(mockedApi.post).not.toHaveBeenCalled();
  });

  it('handleAddComment posts the comment, appends it, and resets the inputs', async () => {
    mockedApi.get.mockResolvedValue({ data: trackResponse });
    const newComment = { _id: 'c1', username: 'u', text: 't' };
    mockedApi.post.mockResolvedValue({ data: newComment });

    const { result } = renderHook(() => useTrackDetails('id1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.username.onChange({
        target: { value: 'u' },
      } as ChangeEvent<HTMLInputElement>);
      result.current.commentText.onChange({
        target: { value: 't' },
      } as ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleAddComment();
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/tracks/comment', {
      username: 'u',
      text: 't',
      trackId: 'id1',
    });
    expect(result.current.track?.comments).toEqual([newComment]);
    expect(result.current.username.value).toBe('');
    expect(result.current.commentText.value).toBe('');
  });

  it('handleAddComment uses the logged-in user name instead of the username field', async () => {
    mockedUseAuth.mockReturnValue({
      user: { name: 'Alice' },
      isActivated: true,
      loading: false,
    });
    mockedApi.get.mockResolvedValue({ data: trackResponse });
    const newComment = { _id: 'c1', username: 'Alice', text: 't' };
    mockedApi.post.mockResolvedValue({ data: newComment });

    const { result } = renderHook(() => useTrackDetails('id1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isActivated).toBe(true);

    act(() => {
      result.current.commentText.onChange({
        target: { value: 't' },
      } as ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      await result.current.handleAddComment();
    });

    expect(mockedApi.post).toHaveBeenCalledWith('/tracks/comment', {
      username: 'Alice',
      text: 't',
      trackId: 'id1',
    });
  });

  it('handleAddComment shows an alert on failure', async () => {
    mockedApi.get.mockResolvedValue({ data: trackResponse });
    mockedApi.post.mockRejectedValue(new Error('Cannot add comment'));

    const { result } = renderHook(() => useTrackDetails('id1'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleAddComment();
    });

    expect(showAlert).toHaveBeenCalledWith('Cannot add comment');
  });
});
