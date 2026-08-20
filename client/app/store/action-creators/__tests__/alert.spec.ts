import { AlertActionTypes } from '@/app/types/alert';

import { hideAlert, showAlert } from '../alert';

describe('showAlert', () => {
  it('defaults the severity to error', () => {
    expect(showAlert('Oops')).toEqual({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Oops', severity: 'error' },
    });
  });

  it('accepts an explicit severity', () => {
    expect(showAlert('Done', 'success')).toEqual({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Done', severity: 'success' },
    });
  });
});

describe('hideAlert', () => {
  it('returns a HIDE_ALERT action', () => {
    expect(hideAlert()).toEqual({ type: AlertActionTypes.HIDE_ALERT });
  });
});
