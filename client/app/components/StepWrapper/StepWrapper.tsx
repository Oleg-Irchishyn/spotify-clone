import { FC } from 'react';
import { StepWrapperProps } from '@/app/types/stepWrapper';
import { Card, Container, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { steps } from '@/app/constants/stepper';

const StepWrapper: FC<Readonly<StepWrapperProps>> = ({ activeStep, children }) => {
  return (
    <Container>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => {
          return (
            <Step key={`${step}_${index}`} completed={activeStep > index}>
              <StepLabel>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <Grid container sx={{ justifyContent: 'center', margin: '70px 0', height: 270 }}>
        <Card sx={{ width: 600 }}>{children}</Card>
      </Grid>
    </Container>
  );
};

export default StepWrapper;
