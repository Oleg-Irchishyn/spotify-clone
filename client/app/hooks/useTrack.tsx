import { useRouter } from 'next/navigation';
import { SyntheticEvent } from 'react';

import { useActions } from './useActions';
import { useTypedSelector } from './useTypedSelector';
import { ROUTES } from '../constants/routes';
import { ITrack } from '../types/tracks';

const useTrack = (track: ITrack) => {
  const router = useRouter();

  const { active, pause, currentTime, duration } = useTypedSelector(
    (state) => state.player,
  );
  const { playTrack, pauseTrack, setActiveTrack } = useActions();

  const isActive = active?._id === track._id;
  const isPlaying = isActive && !pause;

  const handleTrackDetailsRedirect = () => {
    router.push(ROUTES.TRACK_DETAILS(track._id));
  };

  const handlePlay = (e: SyntheticEvent) => {
    e.stopPropagation();

    if (!isActive) {
      setActiveTrack(track);
      playTrack();
      return;
    }

    if (pause) {
      playTrack();
    } else {
      pauseTrack();
    }
  };

  return {
    handleTrackDetailsRedirect,
    handlePlay,
    isActive,
    isPlaying,
    currentTime,
    duration,
  };
};

export default useTrack;
