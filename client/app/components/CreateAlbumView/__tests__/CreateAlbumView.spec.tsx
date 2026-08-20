jest.mock('@/app/hooks/useCreateAlbum', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';

import useCreateAlbum from '@/app/hooks/useCreateAlbum';

import CreateAlbumView from '../CreateAlbumView';

const mockedUseCreateAlbum = useCreateAlbum as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseRouter.mockReturnValue({ back: jest.fn() });
});

describe('CreateAlbumView', () => {
  it('renders the current step content', () => {
    mockedUseCreateAlbum.mockReturnValue({
      activeStep: 0,
      handleNextStep: jest.fn(),
      handlePrevStep: jest.fn(),
      renderStepContent: () => <div>step content</div>,
    });

    render(<CreateAlbumView />);

    expect(screen.getByText('step content')).toBeInTheDocument();
  });

  it('disables Back on the first step and calls handleNextStep on Continue', async () => {
    const handleNextStep = jest.fn();
    mockedUseCreateAlbum.mockReturnValue({
      activeStep: 0,
      handleNextStep,
      handlePrevStep: jest.fn(),
      renderStepContent: () => null,
    });

    render(<CreateAlbumView />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(handleNextStep).toHaveBeenCalled();
  });

  it('enables Back on later steps and calls handlePrevStep', async () => {
    const handlePrevStep = jest.fn();
    mockedUseCreateAlbum.mockReturnValue({
      activeStep: 1,
      handleNextStep: jest.fn(),
      handlePrevStep,
      renderStepContent: () => null,
    });

    render(<CreateAlbumView />);
    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeEnabled();

    await userEvent.click(backButton);

    expect(handlePrevStep).toHaveBeenCalled();
  });
});
