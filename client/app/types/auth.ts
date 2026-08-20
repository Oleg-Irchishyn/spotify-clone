type AuthMode = 'login' | 'registration';

interface IAuthUser {
  email: string;
  name: string;
  isActivated: boolean;
}

interface AuthState {
  user: IAuthUser | null;
  loading: boolean;
}

enum AuthActionTypes {
  SET_USER = 'SET_USER',
  CLEAR_USER = 'CLEAR_USER',
  SET_AUTH_LOADING = 'SET_AUTH_LOADING',
}

interface SetUserAction {
  type: AuthActionTypes.SET_USER;
  payload: IAuthUser;
}

interface ClearUserAction {
  type: AuthActionTypes.CLEAR_USER;
}

interface SetAuthLoadingAction {
  type: AuthActionTypes.SET_AUTH_LOADING;
  payload: boolean;
}

type AuthAction = SetUserAction | ClearUserAction | SetAuthLoadingAction;

export {
  type AuthMode,
  type IAuthUser,
  type AuthState,
  AuthActionTypes,
  type AuthAction,
};
