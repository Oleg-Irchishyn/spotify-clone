jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

import { renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';

import { useActions } from '../useActions';

describe('useActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockedUseDispatch = useDispatch as unknown as jest.Mock;

  it('binds all action creators to dispatch', () => {
    const dispatch = jest.fn();
    mockedUseDispatch.mockReturnValue(dispatch);

    const { result } = renderHook(() => useActions());
    result.current.hideAlert();

    expect(dispatch).toHaveBeenCalledWith({ type: 'HIDE_ALERT' });
  });

  it('memoizes the bound actions across renders with the same dispatch', () => {
    const dispatch = jest.fn();
    mockedUseDispatch.mockReturnValue(dispatch);

    const { result, rerender } = renderHook(() => useActions());
    const first = result.current;
    rerender();

    expect(result.current).toBe(first);
  });
});
