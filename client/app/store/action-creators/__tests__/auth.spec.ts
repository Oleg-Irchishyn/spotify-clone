jest.mock('@/app/lib/http', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

import $api from '@/app/lib/http';
import { AlertActionTypes } from '@/app/types/alert';
import { AuthActionTypes, IAuthUser } from '@/app/types/auth';

import { fetchCurrentUser, login, logout, register } from '../auth';

const mockedApi = $api as jest.Mocked<typeof $api>;

const user: IAuthUser = { email: 'a@test.com', name: 'A', isActivated: true };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchCurrentUser', () => {
  it('sets the user and stops loading on success', async () => {
    mockedApi.get.mockResolvedValue({ data: { user } });
    const dispatch = jest.fn();

    await fetchCurrentUser()(dispatch);

    expect(mockedApi.get).toHaveBeenCalledWith('/auth/me');
    expect(dispatch).toHaveBeenCalledWith({
      type: AuthActionTypes.SET_USER,
      payload: user,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AuthActionTypes.SET_AUTH_LOADING,
      payload: false,
    });
  });

  it('clears the user and stops loading on failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('401'));
    const dispatch = jest.fn();

    await fetchCurrentUser()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({ type: AuthActionTypes.CLEAR_USER });
    expect(dispatch).toHaveBeenCalledWith({
      type: AuthActionTypes.SET_AUTH_LOADING,
      payload: false,
    });
  });
});

describe('login', () => {
  it('sets the user and shows a success alert', async () => {
    mockedApi.post.mockResolvedValue({ data: { user } });
    const dispatch = jest.fn();

    await login('a@test.com', '12345')(dispatch);

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'a@test.com',
      password: '12345',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AuthActionTypes.SET_USER,
      payload: user,
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: {
        message: 'You have successfully entered as A',
        severity: 'success',
      },
    });
  });

  it('shows an error alert and rethrows on failure', async () => {
    mockedApi.post.mockRejectedValue(new Error('Incorrect email or password'));
    const dispatch = jest.fn();

    await expect(login('a@test.com', 'wrong')(dispatch)).rejects.toThrow(
      'Incorrect email or password',
    );

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Incorrect email or password', severity: 'error' },
    });
  });
});

describe('register', () => {
  it('sets the user and shows a success alert', async () => {
    mockedApi.post.mockResolvedValue({ data: { user } });
    const dispatch = jest.fn();

    await register('a@test.com', 'A', '12345')(dispatch);

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/registration', {
      email: 'a@test.com',
      name: 'A',
      password: '12345',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AuthActionTypes.SET_USER,
      payload: user,
    });
  });

  it('shows an error alert and rethrows on failure', async () => {
    mockedApi.post.mockRejectedValue(
      new Error('User with such email already exists'),
    );
    const dispatch = jest.fn();

    await expect(
      register('a@test.com', 'A', '12345')(dispatch),
    ).rejects.toThrow('User with such email already exists');

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: {
        message: 'User with such email already exists',
        severity: 'error',
      },
    });
  });
});

describe('logout', () => {
  it('clears the user and shows a success alert on success', async () => {
    mockedApi.post.mockResolvedValue({});
    const dispatch = jest.fn();

    await logout()(dispatch);

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/logout');
    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: {
        message: 'You have successfully logged out',
        severity: 'success',
      },
    });
    expect(dispatch).toHaveBeenCalledWith({ type: AuthActionTypes.CLEAR_USER });
  });

  it('shows an error alert but still clears the user on failure', async () => {
    mockedApi.post.mockRejectedValue(new Error('Network error'));
    const dispatch = jest.fn();

    await logout()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Network error', severity: 'error' },
    });
    expect(dispatch).toHaveBeenCalledWith({ type: AuthActionTypes.CLEAR_USER });
  });
});
