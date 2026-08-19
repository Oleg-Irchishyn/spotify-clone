import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import { IAlbum } from '../types/albums';

const useEditAlbum = (album: IAlbum, onClose: () => void) => {
  const { updateAlbum } = useActions();

  const name = useInput(album.name);
  const author = useInput(album.author);
  const [picture, setPicture] = useState<File>();

  const isDirty =
    name.value !== album.name ||
    author.value !== album.author ||
    picture !== undefined;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('author', author.value);
    if (picture) {
      formData.append('picture', picture);
    }

    updateAlbum(album._id, formData);
    onClose();
  };

  return {
    name,
    author,
    picture,
    setPicture,
    isDirty,
    handleSubmit,
  };
};

export default useEditAlbum;
