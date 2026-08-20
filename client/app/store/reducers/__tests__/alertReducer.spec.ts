import { AlertActionTypes } from '@/app/types/alert';

import { alertReducer } from '../alertReducer';

describe('alertReducer', () => {
  it('returns the initial state by default', () => {
    const state = alertReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({ message: '', severity: 'info', open: false });
  });

  it('SHOW_ALERT sets the message/severity and opens the alert', () => {
    const state = alertReducer(undefined, {
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Oops', severity: 'error' },
    });

    expect(state).toEqual({ message: 'Oops', severity: 'error', open: true });
  });

  it('HIDE_ALERT closes the alert without touching the message', () => {
    const openState = {
      message: 'Oops',
      severity: 'error' as const,
      open: true,
    };

    const state = alertReducer(openState, {
      type: AlertActionTypes.HIDE_ALERT,
    });

    expect(state).toEqual({ message: 'Oops', severity: 'error', open: false });
  });
});
