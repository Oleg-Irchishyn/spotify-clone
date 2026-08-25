import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import { IAlbum } from '../types/albums';

const useEditAlbum = (album: IAlbum, onClose: () => void) => {
  const { updateAlbum } = useActions();

  const name = useInput(album.name);
  const author = useInput(album.author);
  const [picture, setPicture] = useState<File>();
  const [isSaving, setIsSaving] = useState(false);

  const isDirty =
    name.value !== album.name ||
    author.value !== album.author ||
    picture !== undefined;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('author', author.value);
    if (picture) {
      formData.append('picture', picture);
    }

    setIsSaving(true);
    await updateAlbum(album._id, formData);
    setIsSaving(false);
    onClose();
  };

  return {
    name,
    author,
    picture,
    setPicture,
    isDirty,
    isSaving,
    handleSubmit,
  };
};

export default useEditAlbum;
