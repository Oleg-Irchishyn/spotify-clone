jest.mock('@/app/hooks/useCreateTrack', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import useCreateTrack from '@/app/hooks/useCreateTrack';

import CreateTrackView from '../CreateTrackView';

const mockedUseCreateTrack = useCreateTrack as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseRouter.mockReturnValue({ back: jest.fn() });
});

describe('CreateTrackView', () => {
  it('renders the current step content', () => {
    mockedUseCreateTrack.mockReturnValue({
      activeStep: 0,
      handleNextStep: jest.fn(),
      handlePrevStep: jest.fn(),
      renderStepContent: () => <div>step content</div>,
    });

    render(<CreateTrackView />);

    expect(screen.getByText('step content')).toBeInTheDocument();
  });

  it('disables Back on the first step and calls handleNextStep on Continue', async () => {
    const handleNextStep = jest.fn();
    mockedUseCreateTrack.mockReturnValue({
      activeStep: 0,
      handleNextStep,
      handlePrevStep: jest.fn(),
      renderStepContent: () => null,
    });

    render(<CreateTrackView />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(handleNextStep).toHaveBeenCalled();
  });

  it('enables Back on later steps and calls handlePrevStep', async () => {
    const handlePrevStep = jest.fn();
    mockedUseCreateTrack.mockReturnValue({
      activeStep: 2,
      handleNextStep: jest.fn(),
      handlePrevStep,
      renderStepContent: () => null,
    });

    render(<CreateTrackView />);
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeEnabled();

    await userEvent.click(backButton);

    expect(handlePrevStep).toHaveBeenCalled();
  });
});
