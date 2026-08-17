'use client';

import { Button, Grid } from '@mui/material';

import useCreateTrack from '@/app/hooks/useCreateTrack';
import StepWrapper from '@/app/components/StepWrapper/StepWrapper';

const CreateTrackView = () => {
  const { activeStep, handleNextStep, handlePrevStep, renderStepContent } =
    useCreateTrack();
  return (
    <div>
      <StepWrapper activeStep={activeStep}>{renderStepContent()}</StepWrapper>
      <Grid container sx={{ justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handlePrevStep}>
          Back
        </Button>
        <Button onClick={handleNextStep}>Continue</Button>
      </Grid>
    </div>
  );
};

export default CreateTrackView;
