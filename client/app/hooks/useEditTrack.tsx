import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';

import { useActions } from './useActions';
import { useTypedSelector } from './useTypedSelector';
import useInput from './useInput';
import { ITrack } from '../types/tracks';

const useEditTrack = (track: ITrack, onClose: () => void) => {
  const { updateTrack, fetchAlbums } = useActions();
  const { albums } = useTypedSelector((state) => state.albums);

  const name = useInput(track.name);
  const artist = useInput(track.artist);
  const text = useInput(track.text);
  const [picture, setPicture] = useState<File>();
  const [audio, setAudio] = useState<File>();
  const [albumId, setAlbumId] = useState(track.album ?? '');

  useEffect(() => {
    fetchAlbums('', 100, 0);
  }, [fetchAlbums]);

  const handleAlbumChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAlbumId(e.target.value);
  };

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
    if (albumId) {
      formData.append('album', albumId);
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
    albumId,
    handleAlbumChange,
    albums,
    handleSubmit,
  };
};

export default useEditTrack;
