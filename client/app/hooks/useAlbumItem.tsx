import { useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useAuth from './useAuth';
import { ROUTES } from '../constants/routes';
import { IAlbum } from '../types/albums';

const useAlbumItem = (album: IAlbum) => {
  const router = useRouter();
  const { isActivated } = useAuth();
  const { setActiveAlbum, deleteAlbum } = useActions();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleAlbumOpen = () => {
    setActiveAlbum(album);
    router.push(ROUTES.TRACKS);
  };

  const handleDeleteClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    deleteAlbum(album._id);
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
    handleAlbumOpen,
    isActivated,
    isDeleteConfirmOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isEditOpen,
    handleEditOpen,
    handleEditClose,
  };
};

export default useAlbumItem;
