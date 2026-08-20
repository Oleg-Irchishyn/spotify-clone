jest.mock('@/app/hooks/useHome', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/app/components/AuthForm/AuthForm', () => ({
  __esModule: true,
  default: ({ mode }: { mode: string }) => (
    <div data-testid="auth-form">{mode}</div>
  ),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useHome from '@/app/hooks/useHome';

import HomeView from '../HomeView';

const mockedUseHome = useHome as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HomeView', () => {
  it('shows the auth banner with register/login links when showAuthBanner is true', () => {
    mockedUseHome.mockReturnValue({
      showAuthBanner: true,
      authMode: null,
      openAuthModal: jest.fn(),
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);

    expect(
      screen.getByText(/if you want to see list of other users/),
    ).toBeInTheDocument();
    expect(screen.getByText('register')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();
  });

  it('hides the banner when showAuthBanner is false', () => {
    mockedUseHome.mockReturnValue({
      showAuthBanner: false,
      authMode: null,
      openAuthModal: jest.fn(),
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);

    expect(
      screen.queryByText(/if you want to see list of other users/),
    ).not.toBeInTheDocument();
  });

  it('opens the registration modal when "register" is clicked', async () => {
    const openAuthModal = jest.fn();
    mockedUseHome.mockReturnValue({
      showAuthBanner: true,
      authMode: null,
      openAuthModal,
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);
    await userEvent.click(screen.getByText('register'));

    expect(openAuthModal).toHaveBeenCalledWith('registration');
  });

  it('opens the login modal when "login" is clicked', async () => {
    const openAuthModal = jest.fn();
    mockedUseHome.mockReturnValue({
      showAuthBanner: true,
      authMode: null,
      openAuthModal,
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);
    await userEvent.click(screen.getByText('login'));

    expect(openAuthModal).toHaveBeenCalledWith('login');
  });

  it('does not render the modal when authMode is null', () => {
    mockedUseHome.mockReturnValue({
      showAuthBanner: false,
      authMode: null,
      openAuthModal: jest.fn(),
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);

    expect(screen.queryByTestId('auth-form')).not.toBeInTheDocument();
  });

  it('renders the Login modal when authMode is "login"', () => {
    mockedUseHome.mockReturnValue({
      showAuthBanner: false,
      authMode: 'login',
      openAuthModal: jest.fn(),
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toHaveTextContent('login');
  });

  it('renders the Registration modal when authMode is "registration"', () => {
    mockedUseHome.mockReturnValue({
      showAuthBanner: false,
      authMode: 'registration',
      openAuthModal: jest.fn(),
      closeAuthModal: jest.fn(),
    });

    render(<HomeView />);

    expect(screen.getByText('Registration')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toHaveTextContent('registration');
  });
});
