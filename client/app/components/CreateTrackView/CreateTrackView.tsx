'use client';

import { Button, Grid } from '@mui/material';

import useCreateTrack from '@/app/hooks/useCreateTrack';
import BackButton from '@/app/components/BackButton/BackButton';
import StepWrapper from '@/app/components/StepWrapper/StepWrapper';
import { TRACK_STEPS } from '@/app/constants/stepper';

import styles from '../../styles/CreateTrackView.module.scss';

const CreateTrackView = () => {
  const {
    activeStep,
    submitting,
    handleNextStep,
    handlePrevStep,
    renderStepContent,
  } = useCreateTrack();
  return (
    <div>
      <BackButton />
      <StepWrapper activeStep={activeStep} steps={TRACK_STEPS}>
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

export default CreateTrackView;
