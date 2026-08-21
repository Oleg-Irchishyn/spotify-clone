import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { useActions } from './useActions';
import useInput from './useInput';
import AlbumCreationForm from '../components/AlbumCreationForm/AlbumCreationForm';
import FileUpload from '../components/FileUpload/FileUpload';
import { extractErrorMessage } from '../utils/extractErrorMessage';
import $api from '../lib/http';
import { ROUTES } from '../constants/routes';

const useCreateAlbum = () => {
  const router = useRouter();
  const { showAlert } = useActions();

  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File>();

  const name = useInput('');
  const author = useInput('');

  const handleCreateAlbum = async () => {
    if (!picture) {
      showAlert('Picture file is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('author', author.value);
    formData.append('picture', picture);

    try {
      await $api.post('/album', formData);
      router.push(ROUTES.ALBUMS);
    } catch (error) {
      const message = extractErrorMessage(error);
      showAlert(message);
    }
  };

  const handleNextStep = () => {
    if (activeStep !== 1) {
      setActiveStep((prev) => prev + 1);
      return;
    }

    handleCreateAlbum();
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <AlbumCreationForm name={name} author={author} />;

      case 1:
        return (
          <FileUpload file={picture} setFile={setPicture} accept="image/*">
            <Button component="span">Upload Image</Button>
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

export default useCreateAlbum;
