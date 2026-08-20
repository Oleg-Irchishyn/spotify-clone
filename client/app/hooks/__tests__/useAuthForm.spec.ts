jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { ChangeEvent, FormEvent } from 'react';

import { useActions } from '../useActions';
import useAuthForm from '../useAuthForm';

const mockedUseActions = useActions as jest.Mock;

const change = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe('useAuthForm', () => {
  const login = jest.fn();
  const register = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ login, register });
  });

  it('login mode is valid once email and password are filled (name not required)', () => {
    const { result } = renderHook(() => useAuthForm('login', onSuccess));

    act(() => result.current.email.onChange(change('a@test.com')));
    expect(result.current.isValid).toBe(false);

    act(() => result.current.password.onChange(change('12345')));
    expect(result.current.isValid).toBe(true);
  });

  it('registration mode also requires the name field', () => {
    const { result } = renderHook(() => useAuthForm('registration', onSuccess));

    act(() => result.current.email.onChange(change('a@test.com')));
    act(() => result.current.password.onChange(change('12345')));
    expect(result.current.isValid).toBe(false);

    act(() => result.current.name.onChange(change('A')));
    expect(result.current.isValid).toBe(true);
  });

  it('handleSubmit calls login with email/password in login mode and reports success', async () => {
    login.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuthForm('login', onSuccess));

    act(() => result.current.email.onChange(change('a@test.com')));
    act(() => result.current.password.onChange(change('12345')));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    expect(login).toHaveBeenCalledWith('a@test.com', '12345');
    expect(register).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });

  it('handleSubmit calls register with email/name/password in registration mode', async () => {
    register.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuthForm('registration', onSuccess));

    act(() => result.current.email.onChange(change('a@test.com')));
    act(() => result.current.name.onChange(change('A')));
    act(() => result.current.password.onChange(change('12345')));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    expect(register).toHaveBeenCalledWith('a@test.com', 'A', '12345');
    expect(onSuccess).toHaveBeenCalled();
  });

  it('keeps the form open (does not call onSuccess) when the submission fails', async () => {
    login.mockRejectedValue(new Error('Incorrect email or password'));
    const { result } = renderHook(() => useAuthForm('login', onSuccess));

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: jest.fn(),
      } as unknown as FormEvent);
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(result.current.submitting).toBe(false);
  });

  it('prevents the default form submission behavior', async () => {
    login.mockResolvedValue(undefined);
    const { result } = renderHook(() => useAuthForm('login', onSuccess));
    const preventDefault = jest.fn();

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault,
      } as unknown as FormEvent);
    });

    expect(preventDefault).toHaveBeenCalled();
  });
});
