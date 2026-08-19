import {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { useActions } from './useActions';
import { useTypedSelector } from './useTypedSelector';

const usePlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { pause, volume, active, duration, currentTime, loop } =
    useTypedSelector((state) => state.player);

  const { pauseTrack, playTrack, setVolume, setCurrentTime, setDuration } =
    useActions();

  const setAudio = useCallback(
    (src: string) => {
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      const audio = audioRef.current;
      audio.src = src;

      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => {
        // audio.duration can be re-estimated during playback (common for
        // streamed MP3s), so re-read it here instead of trusting the
        // possibly-stale `duration` already in state - otherwise the
        // slider's max and the forced end value can mismatch and the
        // thumb visibly stops just short of the end.
        setDuration(audio.duration);
        setCurrentTime(audio.duration);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    },
    [setDuration, setCurrentTime],
  );

  useEffect(() => {
    if (!active) {
      return;
    }

    return setAudio(active.audio);
  }, [active, setAudio]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = loop;
    }
  }, [loop]);

  useEffect(() => {
    if (!audioRef.current || !active) {
      return;
    }

    if (pause) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [pause, active]);

  const hanlePlay = (e: SyntheticEvent) => {
    e.stopPropagation();
    if (pause) {
      playTrack();
    } else {
      pauseTrack();
    }
  };

  const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  return {
    active,
    pause,
    hanlePlay,
    progress: currentTime,
    duration,
    handleProgressChange,
    volume,
    handleVolumeChange,
  };
};

export default usePlayer;
