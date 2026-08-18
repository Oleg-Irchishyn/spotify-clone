'use client';

import { Button, Grid } from '@mui/material';

import useCreateTrack from '@/app/hooks/useCreateTrack';
import StepWrapper from '@/app/components/StepWrapper/StepWrapper';

import styles from '../../styles/CreateTrackView.module.scss';

const CreateTrackView = () => {
  const { activeStep, handleNextStep, handlePrevStep, renderStepContent } =
    useCreateTrack();
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

export default CreateTrackView;
