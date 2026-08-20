import { AuthActionTypes } from '@/app/types/auth';

import { authReducer } from '../authReducer';

describe('authReducer', () => {
  it('returns the initial state by default', () => {
    const state = authReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({ user: null, loading: true });
  });

  it('SET_USER stores the user', () => {
    const user = { email: 'a@test.com', name: 'A', isActivated: true };

    const state = authReducer(undefined, {
      type: AuthActionTypes.SET_USER,
      payload: user,
    });

    expect(state.user).toEqual(user);
  });

  it('CLEAR_USER resets the user to null', () => {
    const loggedInState = {
      user: { email: 'a@test.com', name: 'A', isActivated: true },
      loading: false,
    };

    const state = authReducer(loggedInState, {
      type: AuthActionTypes.CLEAR_USER,
    });

    expect(state.user).toBeNull();
  });

  it('SET_AUTH_LOADING updates the loading flag', () => {
    const state = authReducer(undefined, {
      type: AuthActionTypes.SET_AUTH_LOADING,
      payload: false,
    });

    expect(state.loading).toBe(false);
  });
});
