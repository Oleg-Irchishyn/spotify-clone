import { act, renderHook } from '@testing-library/react';
import { ChangeEvent } from 'react';

import useInput from '../useInput';

describe('useInput', () => {
  it('initializes with the given value', () => {
    const { result } = renderHook(() => useInput('hello'));

    expect(result.current.value).toBe('hello');
  });

  it('updates the value onChange', () => {
    const { result } = renderHook(() => useInput(''));

    act(() => {
      result.current.onChange({
        target: { value: 'new value' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.value).toBe('new value');
  });

  it('reset() restores the initial value', () => {
    const { result } = renderHook(() => useInput('initial'));

    act(() => {
      result.current.onChange({
        target: { value: 'changed' },
      } as ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.value).toBe('changed');

    act(() => {
      result.current.reset();
    });
    expect(result.current.value).toBe('initial');
  });
});
