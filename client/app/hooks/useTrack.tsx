import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useAuth from './useAuth';
import { useTypedSelector } from './useTypedSelector';
import { ROUTES } from '../constants/routes';
import { ITrack } from '../types/tracks';

const useTrack = (track: ITrack) => {
  const router = useRouter();
  const { isActivated } = useAuth();

  const { active, pause, currentTime, duration, loop } = useTypedSelector(
    (state) => state.player,
  );
  const {
    playTrack,
    pauseTrack,
    setActiveTrack,
    toggleLoop,
    deleteTrack,
    listenTrack,
  } = useActions();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
      listenTrack(track._id);
      return;
    }

    if (pause) {
      playTrack();
    } else {
      pauseTrack();
    }
  };

  const handleToggleLoop = (e: SyntheticEvent) => {
    e.stopPropagation();

    if (!isActive) {
      return;
    }

    toggleLoop();
  };

  const handleDeleteClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteTrack(track._id);
    setIsDeleteConfirmOpen(false);
  };

  const handleEditOpen = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsEditOpen(true);
  };

  const handleEditClose = () => {
    setIsEditOpen(false);
  };

  return {
    handleTrackDetailsRedirect,
    handlePlay,
    isActivated,
    isActive,
    isPlaying,
    currentTime,
    duration,
    loop,
    handleToggleLoop,
    isDeleteConfirmOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isEditOpen,
    handleEditOpen,
    handleEditClose,
  };
};

export default useTrack;
