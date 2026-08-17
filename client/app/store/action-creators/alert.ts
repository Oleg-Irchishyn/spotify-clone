import {
  AlertAction,
  AlertActionTypes,
  AlertSeverity,
} from '@/app/types/alert';

const showAlert = (
  message: string,
  severity: AlertSeverity = 'error',
): AlertAction => ({
  type: AlertActionTypes.SHOW_ALERT,
  payload: { message, severity },
});

const hideAlert = (): AlertAction => ({ type: AlertActionTypes.HIDE_ALERT });

export { showAlert, hideAlert };
