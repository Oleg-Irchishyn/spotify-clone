import { AuthAction, AuthActionTypes, AuthState } from '@/app/types/auth';

const initialState: AuthState = {
  user: null,
  loading: true,
};

export const authReducer = (
  state = initialState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case AuthActionTypes.SET_USER:
      return { ...state, user: action.payload };
    case AuthActionTypes.CLEAR_USER:
      return { ...state, user: null };
    case AuthActionTypes.SET_AUTH_LOADING:
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};
