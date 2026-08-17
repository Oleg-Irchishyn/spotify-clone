type AlertSeverity = 'error' | 'warning' | 'info' | 'success';

interface AlertState {
  message: string;
  severity: AlertSeverity;
  open: boolean;
}

enum AlertActionTypes {
  SHOW_ALERT = 'SHOW_ALERT',
  HIDE_ALERT = 'HIDE_ALERT',
}

interface ShowAlertAction {
  type: AlertActionTypes.SHOW_ALERT;
  payload: { message: string; severity: AlertSeverity };
}

interface HideAlertAction {
  type: AlertActionTypes.HIDE_ALERT;
}

type AlertAction = ShowAlertAction | HideAlertAction;

export {
  type AlertState,
  type AlertSeverity,
  AlertActionTypes,
  type AlertAction,
};
