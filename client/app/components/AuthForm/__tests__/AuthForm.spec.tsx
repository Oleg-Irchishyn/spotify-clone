jest.mock('@/app/hooks/useActions', () => ({
  useActions: jest.fn(),
}));

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useActions } from '@/app/hooks/useActions';

import AuthForm from '../AuthForm';

const mockedUseActions = useActions as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseActions.mockReturnValue({ login: jest.fn(), register: jest.fn() });
});

describe('AuthForm', () => {
  it('renders email/password fields but not name in login mode', () => {
    render(
      <AuthForm mode="login" onModeChange={jest.fn()} onClose={jest.fn()} />,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders the name field in registration mode', () => {
    render(
      <AuthForm
        mode="registration"
        onModeChange={jest.fn()}
        onClose={jest.fn()}
      />,
    );

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' }),
    ).toBeInTheDocument();
  });

  it('disables submit until the required fields are filled', async () => {
    render(
      <AuthForm mode="login" onModeChange={jest.fn()} onClose={jest.fn()} />,
    );

    const submit = screen.getByRole('button', { name: 'Login' });
    expect(submit).toBeDisabled();

    await userEvent.type(screen.getByLabelText('Email'), 'a@test.com');
    await userEvent.type(screen.getByLabelText('Password'), '12345');

    expect(submit).toBeEnabled();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const onClose = jest.fn();
    render(
      <AuthForm mode="login" onModeChange={jest.fn()} onClose={onClose} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('switches from login to registration mode', async () => {
    const onModeChange = jest.fn();
    render(
      <AuthForm mode="login" onModeChange={onModeChange} onClose={jest.fn()} />,
    );

    await userEvent.click(screen.getByText('Register'));

    expect(onModeChange).toHaveBeenCalledWith('registration');
  });

  it('switches from registration to login mode', async () => {
    const onModeChange = jest.fn();
    render(
      <AuthForm
        mode="registration"
        onModeChange={onModeChange}
        onClose={jest.fn()}
      />,
    );

    await userEvent.click(screen.getByText('Login'));

    expect(onModeChange).toHaveBeenCalledWith('login');
  });

  it('submits the login form and closes on success', async () => {
    const login = jest.fn().mockResolvedValue(undefined);
    mockedUseActions.mockReturnValue({ login, register: jest.fn() });
    const onClose = jest.fn();

    render(
      <AuthForm mode="login" onModeChange={jest.fn()} onClose={onClose} />,
    );
    await userEvent.type(screen.getByLabelText('Email'), 'a@test.com');
    await userEvent.type(screen.getByLabelText('Password'), '12345');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(login).toHaveBeenCalledWith('a@test.com', '12345');
    expect(onClose).toHaveBeenCalled();
  });
});
