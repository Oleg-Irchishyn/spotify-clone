'use client';

import { Button, Grid } from '@mui/material';

import useCreateAlbum from '@/app/hooks/useCreateAlbum';
import BackButton from '@/app/components/BackButton/BackButton';
import StepWrapper from '@/app/components/StepWrapper/StepWrapper';
import { ALBUM_STEPS } from '@/app/constants/stepper';

import styles from '../../styles/CreateAlbumView.module.scss';

const CreateAlbumView = () => {
  const {
    activeStep,
    submitting,
    handleNextStep,
    handlePrevStep,
    renderStepContent,
  } = useCreateAlbum();
  return (
    <div>
      <BackButton />
      <StepWrapper activeStep={activeStep} steps={ALBUM_STEPS}>
        {renderStepContent()}
      </StepWrapper>
      <Grid container className={styles.actions_row}>
        <Button
          disabled={activeStep === 0 || submitting}
          onClick={handlePrevStep}
        >
          Back
        </Button>
        <Button onClick={handleNextStep} loading={submitting}>
          Continue
        </Button>
      </Grid>
    </div>
  );
};

export default CreateAlbumView;
