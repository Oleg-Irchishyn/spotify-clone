import { AxiosError, AxiosHeaders } from 'axios';

import { extractErrorMessage } from '../extractErrorMessage';

const buildAxiosError = (data: unknown): AxiosError =>
  new AxiosError(
    'Request failed with status code 400',
    'ERR_BAD_REQUEST',
    undefined,
    undefined,
    {
      status: 400,
      statusText: 'Bad Request',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
      data,
    },
  );

describe('extractErrorMessage', () => {
  it('returns the response message when it is a string', () => {
    const error = buildAxiosError({ message: 'Incorrect email or password' });

    expect(extractErrorMessage(error)).toBe('Incorrect email or password');
  });

  it('joins an array of messages with a comma', () => {
    const error = buildAxiosError({
      message: ['name is required', 'email is invalid'],
    });

    expect(extractErrorMessage(error)).toBe(
      'name is required, email is invalid',
    );
  });

  it('falls back to the axios error message when there is no response data', () => {
    const error = new AxiosError('Network Error');

    expect(extractErrorMessage(error)).toBe('Network Error');
  });

  it('falls back to the axios error message when the response message is empty array', () => {
    const error = buildAxiosError({ message: [] });

    expect(extractErrorMessage(error)).toBe(
      'Request failed with status code 400',
    );
  });

  it('falls back to a generic Error message for a non-axios Error', () => {
    expect(extractErrorMessage(new Error('boom'))).toBe('boom');
  });

  it('falls back to the provided fallback for a non-Error value', () => {
    expect(extractErrorMessage('nope', 'Custom fallback')).toBe(
      'Custom fallback',
    );
  });

  it('defaults the fallback to "Server error"', () => {
    expect(extractErrorMessage(null)).toBe('Server error');
  });
});
