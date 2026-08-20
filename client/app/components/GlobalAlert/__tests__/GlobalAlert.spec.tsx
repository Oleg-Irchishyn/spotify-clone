jest.mock('@/app/hooks/useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('@/app/hooks/useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useActions } from '@/app/hooks/useActions';
import { useTypedSelector } from '@/app/hooks/useTypedSelector';

import GlobalAlert from '../GlobalAlert';

const mockedUseActions = useActions as jest.Mock;
const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;

describe('GlobalAlert', () => {
  const hideAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ hideAlert });
  });

  it('renders the message when open', () => {
    mockedUseTypedSelector.mockReturnValue({
      message: 'Oops',
      severity: 'error',
      open: true,
    });

    render(<GlobalAlert />);

    expect(screen.getByText('Oops')).toBeInTheDocument();
  });

  it('does not render the message when closed', () => {
    mockedUseTypedSelector.mockReturnValue({
      message: '',
      severity: 'info',
      open: false,
    });

    render(<GlobalAlert />);

    expect(screen.queryByText('Oops')).not.toBeInTheDocument();
  });

  it('calls hideAlert when the close button is clicked', async () => {
    mockedUseTypedSelector.mockReturnValue({
      message: 'Oops',
      severity: 'error',
      open: true,
    });

    render(<GlobalAlert />);
    await userEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(hideAlert).toHaveBeenCalled();
  });
});
