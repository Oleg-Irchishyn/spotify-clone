jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';

import { useActions } from '../useActions';
import usePlayer from '../usePlayer';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseActions = useActions as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;

describe('usePlayer', () => {
  const pauseTrack = jest.fn();
  const playTrack = jest.fn();
  const setVolume = jest.fn();
  const setCurrentTime = jest.fn();
  const setDuration = jest.fn();
  let playerState: {
    pause: boolean;
    volume: number;
    active: { _id: string; audio: string } | null;
    duration: number;
    currentTime: number;
    loop: boolean;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    playerState = {
      pause: true,
      volume: 100,
      active: null,
      duration: 0,
      currentTime: 0,
      loop: false,
    };
    mockedUseActions.mockReturnValue({
      pauseTrack,
      playTrack,
      setVolume,
      setCurrentTime,
      setDuration,
    });
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({ player: playerState }),
    );
  });

  it('hanlePlay calls playTrack when currently paused', () => {
    const { result } = renderHook(() => usePlayer());
    const stopPropagation = jest.fn();

    act(() => {
      result.current.hanlePlay({ stopPropagation } as never);
    });

    expect(stopPropagation).toHaveBeenCalled();
    expect(playTrack).toHaveBeenCalled();
    expect(pauseTrack).not.toHaveBeenCalled();
  });

  it('hanlePlay calls pauseTrack when currently playing', () => {
    playerState.pause = false;
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.hanlePlay({ stopPropagation: jest.fn() } as never);
    });

    expect(pauseTrack).toHaveBeenCalled();
  });

  it('handleProgressChange updates currentTime', () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.handleProgressChange({
        target: { value: '42' },
      } as never);
    });

    expect(setCurrentTime).toHaveBeenCalledWith(42);
  });

  it('handleVolumeChange updates volume', () => {
    const { result } = renderHook(() => usePlayer());

    act(() => {
      result.current.handleVolumeChange({ target: { value: '50' } } as never);
    });

    expect(setVolume).toHaveBeenCalledWith(50);
  });

  class FakeAudio extends EventTarget {
    src = '';
    duration = 0;
    currentTime = 0;
    volume = 1;
    loop = false;
    play = jest.fn().mockResolvedValue(undefined);
    pause = jest.fn();
  }

  const spyOnAudio = () => {
    const instances: FakeAudio[] = [];
    const AudioSpy = jest.spyOn(window, 'Audio').mockImplementation(() => {
      const instance = new FakeAudio();
      instances.push(instance);
      return instance as unknown as HTMLAudioElement;
    });

    return { AudioSpy, instances };
  };

  it('creates an <audio> element for the active track and dispatches duration/time updates', () => {
    const { AudioSpy, instances } = spyOnAudio();
    playerState.active = { _id: 'id1', audio: 'track.mp3' };

    const { rerender } = renderHook(() => usePlayer());
    rerender();

    const audioInstance = instances[0];
    expect(audioInstance.src).toContain('track.mp3');

    audioInstance.duration = 180;
    act(() => {
      audioInstance.dispatchEvent(new Event('loadedmetadata'));
    });
    expect(setDuration).toHaveBeenCalledWith(180);

    audioInstance.currentTime = 30;
    act(() => {
      audioInstance.dispatchEvent(new Event('timeupdate'));
    });
    expect(setCurrentTime).toHaveBeenCalledWith(30);

    act(() => {
      audioInstance.dispatchEvent(new Event('durationchange'));
    });
    expect(setDuration).toHaveBeenCalledWith(180);

    act(() => {
      audioInstance.dispatchEvent(new Event('ended'));
    });
    expect(setCurrentTime).toHaveBeenCalledWith(180);

    AudioSpy.mockRestore();
  });

  it('reuses the same audio element when the active track changes', () => {
    const { AudioSpy, instances } = spyOnAudio();
    playerState.active = { _id: 'id1', audio: 'track1.mp3' };
    const { rerender } = renderHook(() => usePlayer());
    rerender();

    playerState.active = { _id: 'id2', audio: 'track2.mp3' };
    rerender();

    expect(instances).toHaveLength(1);
    expect(instances[0].src).toContain('track2.mp3');

    AudioSpy.mockRestore();
  });

  it('applies volume/loop state to the audio element', () => {
    const { AudioSpy, instances } = spyOnAudio();
    playerState.active = { _id: 'id1', audio: 'track.mp3' };
    const { rerender } = renderHook(() => usePlayer());
    rerender();

    playerState.volume = 40;
    playerState.loop = true;
    rerender();

    expect(instances[0].volume).toBeCloseTo(0.4);
    expect(instances[0].loop).toBe(true);

    AudioSpy.mockRestore();
  });

  it('plays the audio element when a track is active and not paused', () => {
    const { AudioSpy, instances } = spyOnAudio();
    playerState.active = { _id: 'id1', audio: 'track.mp3' };
    playerState.pause = false;

    renderHook(() => usePlayer());

    expect(instances[0].play).toHaveBeenCalled();
    AudioSpy.mockRestore();
  });

  it('pauses the audio element when a track is active and paused', () => {
    const { AudioSpy, instances } = spyOnAudio();
    playerState.active = { _id: 'id1', audio: 'track.mp3' };
    playerState.pause = true;

    renderHook(() => usePlayer());

    expect(instances[0].pause).toHaveBeenCalled();
    AudioSpy.mockRestore();
  });
});
