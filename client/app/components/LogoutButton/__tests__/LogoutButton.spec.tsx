jest.mock('@/app/hooks/useLogoutButton', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useLogoutButton from '@/app/hooks/useLogoutButton';

import LogoutButton from '../LogoutButton';

const mockedUseLogoutButton = useLogoutButton as unknown as jest.Mock;

const baseHook = {
  isActivated: true,
  isConfirmOpen: false,
  handleLogoutClick: jest.fn(),
  handleCancel: jest.fn(),
  handleConfirm: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('LogoutButton', () => {
  it('renders nothing when not activated', () => {
    mockedUseLogoutButton.mockReturnValue({ ...baseHook, isActivated: false });

    const { container } = render(<LogoutButton />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the logout icon button when activated', () => {
    mockedUseLogoutButton.mockReturnValue({ ...baseHook });

    render(<LogoutButton />);

    expect(screen.getByLabelText('logout')).toBeInTheDocument();
  });

  it('calls handleLogoutClick when clicked', async () => {
    const handleLogoutClick = jest.fn();
    mockedUseLogoutButton.mockReturnValue({ ...baseHook, handleLogoutClick });

    render(<LogoutButton />);
    await userEvent.click(screen.getByLabelText('logout'));

    expect(handleLogoutClick).toHaveBeenCalled();
  });

  it('shows the confirm dialog and wires confirm/cancel handlers', async () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    mockedUseLogoutButton.mockReturnValue({
      ...baseHook,
      isConfirmOpen: true,
      handleConfirm,
      handleCancel,
    });

    render(<LogoutButton />);
    expect(
      screen.getByText('Are you sure you want to log out?'),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Log out' }));
    expect(handleConfirm).toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleCancel).toHaveBeenCalled();
  });
});
