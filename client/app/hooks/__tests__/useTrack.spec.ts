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

import { ROUTES } from '@/app/constants/routes';
import { ITrack } from '@/app/types/tracks';

import { useActions } from '../useActions';
import useAuth from '../useAuth';
import useTrack from '../useTrack';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as unknown as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

describe('useTrack', () => {
  const track: ITrack = {
    _id: 'id1',
    name: 'Track',
    artist: 'Artist',
    text: '',
    listens: 0,
    audio: 'audio.mp3',
    picture: 'picture.jpg',
    comments: [],
  };
  const playTrack = jest.fn();
  const pauseTrack = jest.fn();
  const setActiveTrack = jest.fn();
  const toggleLoop = jest.fn();
  const deleteTrack = jest.fn();
  const listenTrack = jest.fn();
  const push = jest.fn();
  const stopPropagation = jest.fn();

  let playerState: {
    active: ITrack | null;
    pause: boolean;
    currentTime: number;
    duration: number;
    loop: boolean;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    playerState = {
      active: null,
      pause: true,
      currentTime: 0,
      duration: 0,
      loop: false,
    };
    mockedUseActions.mockReturnValue({
      playTrack,
      pauseTrack,
      setActiveTrack,
      toggleLoop,
      deleteTrack,
      listenTrack,
    });
    mockedUseAuth.mockReturnValue({ isActivated: true });
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({ player: playerState }),
    );
    mockedUseRouter.mockReturnValue({ push });
  });

  it('is not active/playing when a different track is active', () => {
    const { result } = renderHook(() => useTrack(track));

    expect(result.current.isActive).toBe(false);
    expect(result.current.isPlaying).toBe(false);
  });

  it('is active and playing when this track is active and not paused', () => {
    playerState.active = track;
    playerState.pause = false;

    const { result } = renderHook(() => useTrack(track));

    expect(result.current.isActive).toBe(true);
    expect(result.current.isPlaying).toBe(true);
  });

  it('handleTrackDetailsRedirect navigates to the track details route', () => {
    const { result } = renderHook(() => useTrack(track));

    act(() => result.current.handleTrackDetailsRedirect());

    expect(push).toHaveBeenCalledWith(ROUTES.TRACK_DETAILS('id1'));
  });

  it('handlePlay activates, plays, and records a listen when a different track is playing', () => {
    const { result } = renderHook(() => useTrack(track));

    act(() => {
      result.current.handlePlay({ stopPropagation } as never);
    });

    expect(setActiveTrack).toHaveBeenCalledWith(track);
    expect(playTrack).toHaveBeenCalled();
    expect(listenTrack).toHaveBeenCalledWith('id1');
  });

  it('handlePlay resumes playback when this track is active and paused', () => {
    playerState.active = track;
    playerState.pause = true;
    const { result } = renderHook(() => useTrack(track));

    act(() => {
      result.current.handlePlay({ stopPropagation } as never);
    });

    expect(playTrack).toHaveBeenCalled();
    expect(setActiveTrack).not.toHaveBeenCalled();
  });

  it('handlePlay pauses playback when this track is active and playing', () => {
    playerState.active = track;
    playerState.pause = false;
    const { result } = renderHook(() => useTrack(track));

    act(() => {
      result.current.handlePlay({ stopPropagation } as never);
    });

    expect(pauseTrack).toHaveBeenCalled();
  });

  it('handleToggleLoop toggles loop only when the track is active', () => {
    const { result: inactive } = renderHook(() => useTrack(track));
    act(() => {
      inactive.current.handleToggleLoop({ stopPropagation } as never);
    });
    expect(toggleLoop).not.toHaveBeenCalled();

    playerState.active = track;
    const { result: active } = renderHook(() => useTrack(track));
    act(() => {
      active.current.handleToggleLoop({ stopPropagation } as never);
    });
    expect(toggleLoop).toHaveBeenCalled();
  });

  it('delete confirmation flow: open, cancel, and confirm', () => {
    const { result } = renderHook(() => useTrack(track));

    act(() => {
      result.current.handleDeleteClick({ stopPropagation } as never);
    });
    expect(result.current.isDeleteConfirmOpen).toBe(true);

    act(() => result.current.handleDeleteCancel());
    expect(result.current.isDeleteConfirmOpen).toBe(false);
    expect(deleteTrack).not.toHaveBeenCalled();

    act(() => {
      result.current.handleDeleteClick({ stopPropagation } as never);
    });
    act(() => result.current.handleDeleteConfirm());
    expect(deleteTrack).toHaveBeenCalledWith('id1');
    expect(result.current.isDeleteConfirmOpen).toBe(false);
  });

  it('opens and closes the edit modal', () => {
    const { result } = renderHook(() => useTrack(track));

    act(() => {
      result.current.handleEditOpen({ stopPropagation } as never);
    });
    expect(result.current.isEditOpen).toBe(true);

    act(() => result.current.handleEditClose());
    expect(result.current.isEditOpen).toBe(false);
  });

  it('exposes isActivated from useAuth', () => {
    const { result } = renderHook(() => useTrack(track));

    expect(result.current.isActivated).toBe(true);
  });
});
