import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import { useTypedSelector } from './useTypedSelector';
import FileUpload from '../components/FileUpload/FileUpload';
import TrackCreationForm from '../components/TrackCreationForm/TrackCreationForm';
import { extractErrorMessage } from '../utils/extractErrorMessage';
import $api from '../lib/http';
import { ROUTES } from '../constants/routes';

const useCreateTrack = () => {
  const router = useRouter();
  const { showAlert, fetchAlbums } = useActions();
  const { albums } = useTypedSelector((state) => state.albums);

  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File>();
  const [audio, setAudio] = useState<File>();
  const [albumId, setAlbumId] = useState('');

  const name = useInput('');
  const artist = useInput('');
  const text = useInput('');

  useEffect(() => {
    fetchAlbums('', 100, 0);
  }, [fetchAlbums]);

  const handleAlbumChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAlbumId(e.target.value);
  };

  const handleCreateTrack = async () => {
    if (!picture || !audio) {
      showAlert('Picture and audio files are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('artist', artist.value);
    formData.append('text', text.value);
    formData.append('picture', picture);
    formData.append('audio', audio);
    if (albumId) {
      formData.append('album', albumId);
    }

    try {
      await $api.post('/tracks', formData);
      router.push(ROUTES.TRACKS);
    } catch (error) {
      const message = extractErrorMessage(error);
      showAlert(message);
    }
  };

  const handleNextStep = () => {
    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
      return;
    }

    handleCreateTrack();
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <TrackCreationForm
            name={name}
            artist={artist}
            text={text}
            albumId={albumId}
            onAlbumChange={handleAlbumChange}
            albums={albums}
          />
        );

      case 1:
        return (
          <FileUpload file={picture} setFile={setPicture} accept="image/*">
            <Button component="span">Upload Image</Button>
          </FileUpload>
        );

      case 2:
        return (
          <FileUpload file={audio} setFile={setAudio} accept="audio/*">
            <Button component="span">Upload Audio</Button>
          </FileUpload>
        );

      default:
        break;
    }
  };

  return {
    activeStep,
    handleNextStep,
    handlePrevStep,
    renderStepContent,
  };
};

export default useCreateTrack;
