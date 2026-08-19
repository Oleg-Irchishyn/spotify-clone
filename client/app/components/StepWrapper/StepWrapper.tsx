import { Card, Container, Grid, Step, StepLabel, Stepper } from '@mui/material';
import { FC } from 'react';

import { StepWrapperProps } from '@/app/types/stepWrapper';

import styles from '../../styles/StepWrapper.module.scss';

const StepWrapper: FC<Readonly<StepWrapperProps>> = ({
  activeStep,
  steps,
  children,
}) => {
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
      <Grid container className={styles.content_wrapper}>
        <Card className={styles.content_card}>{children}</Card>
      </Grid>
    </Container>
  );
};

export default StepWrapper;
