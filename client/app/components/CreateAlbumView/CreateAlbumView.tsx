'use client';

import { Button, Grid } from '@mui/material';

import useCreateAlbum from '@/app/hooks/useCreateAlbum';
import StepWrapper from '@/app/components/StepWrapper/StepWrapper';

import styles from '../../styles/CreateAlbumView.module.scss';

const CreateAlbumView = () => {
  const { activeStep, handleNextStep, handlePrevStep, renderStepContent } =
    useCreateAlbum();
  return (
    <div>
      <StepWrapper activeStep={activeStep}>{renderStepContent()}</StepWrapper>
      <Grid container className={styles.actions_row}>
        <Button disabled={activeStep === 0} onClick={handlePrevStep}>
          Back
        </Button>
        <Button onClick={handleNextStep}>Continue</Button>
      </Grid>
    </div>
  );
};

export default CreateAlbumView;
