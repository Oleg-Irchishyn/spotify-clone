import { Dispatch } from 'redux';

import $api from '@/app/lib/http';
import { AlertAction } from '@/app/types/alert';
import { AuthAction, AuthActionTypes, IAuthUser } from '@/app/types/auth';

import { showAlert } from './alert';

type AuthResponse = { user: IAuthUser };

const setUser = (user: IAuthUser): AuthAction => ({
  type: AuthActionTypes.SET_USER,
  payload: user,
});

const clearUser = (): AuthAction => ({ type: AuthActionTypes.CLEAR_USER });

const setAuthLoading = (loading: boolean): AuthAction => ({
  type: AuthActionTypes.SET_AUTH_LOADING,
  payload: loading,
});

export const fetchCurrentUser = () => {
  return async (dispatch: Dispatch<AuthAction>) => {
    try {
      const { data } = await $api.get<AuthResponse>('/auth/me');
      dispatch(setUser(data.user));
    } catch {
      dispatch(clearUser());
    } finally {
      dispatch(setAuthLoading(false));
    }
  };
};

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch<AuthAction | AlertAction>) => {
    try {
      const { data } = await $api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      dispatch(setUser(data.user));
      dispatch(
        showAlert(
          `You have successfully entered as ${data.user.name}`,
          'success',
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
      throw error;
    }
  };
};

export const register = (email: string, name: string, password: string) => {
  return async (dispatch: Dispatch<AuthAction | AlertAction>) => {
    try {
      const { data } = await $api.post<AuthResponse>('/auth/registration', {
        email,
        name,
        password,
      });
      dispatch(setUser(data.user));
      dispatch(
        showAlert(
          `You have successfully entered as ${data.user.name}`,
          'success',
        ),
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
      throw error;
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch<AuthAction | AlertAction>) => {
    try {
      await $api.post('/auth/logout');
      dispatch(showAlert('You have successfully logged out', 'success'));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
    } finally {
      dispatch(clearUser());
    }
  };
};
