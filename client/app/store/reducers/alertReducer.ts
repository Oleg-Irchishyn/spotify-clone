import { AlertAction, AlertActionTypes, AlertState } from '@/app/types/alert';

const initialState: AlertState = {
  message: '',
  severity: 'info',
  open: false,
};

export const alertReducer = (
  state = initialState,
  action: AlertAction,
): AlertState => {
  switch (action.type) {
    case AlertActionTypes.SHOW_ALERT:
      return { ...action.payload, open: true };
    case AlertActionTypes.HIDE_ALERT:
      return { ...state, open: false };
    default:
      return state;
  }
};
