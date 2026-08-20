import { render, screen } from '@testing-library/react';

import StepWrapper from '../StepWrapper';

describe('StepWrapper', () => {
  it('renders the step labels and marks earlier steps completed', () => {
    render(
      <StepWrapper activeStep={1} steps={['Details', 'Picture', 'Audio']}>
        <div>content</div>
      </StepWrapper>,
    );

    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Picture')).toBeInTheDocument();
    expect(screen.getByText('Audio')).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <StepWrapper activeStep={0} steps={['Details']}>
        <div>step content</div>
      </StepWrapper>,
    );

    expect(screen.getByText('step content')).toBeInTheDocument();
  });
});
