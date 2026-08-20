import { renderHook } from '@testing-library/react';

import useMounted from '../useMounted';

describe('useMounted', () => {
  it('returns true once mounted on the client', () => {
    const { result } = renderHook(() => useMounted());

    expect(result.current).toBe(true);
  });
});
