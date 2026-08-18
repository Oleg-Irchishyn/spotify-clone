import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import { ITrack } from '../types/tracks';

const useEditTrack = (track: ITrack, onClose: () => void) => {
  const { updateTrack } = useActions();

  const name = useInput(track.name);
  const artist = useInput(track.artist);
  const text = useInput(track.text);
  const [picture, setPicture] = useState<File>();
  const [audio, setAudio] = useState<File>();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('artist', artist.value);
    formData.append('text', text.value);
    if (picture) {
      formData.append('picture', picture);
    }
    if (audio) {
      formData.append('audio', audio);
    }

    updateTrack(track._id, formData);
    onClose();
  };

  return {
    name,
    artist,
    text,
    picture,
    setPicture,
    audio,
    setAudio,
    handleSubmit,
  };
};

export default useEditTrack;
