import { Button } from '@mui/material';
import { useState } from 'react';
import FileUpload from '../components/FileUpload/FileUpload';
import TrackCreationForm from '../components/TrackCreationForm/TrackCreationForm';

const useCreateTrack = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [picture, setPicture] = useState<File>();
  const [audio, setAudio] = useState<File>();

  const handleNextStep = () => {
    if (activeStep !== 2) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <TrackCreationForm />;

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
