import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';

import { useTypedSelector } from '../useTypedSelector';

describe('useTypedSelector', () => {
  it('selects state from the store via react-redux useSelector', () => {
    const store = createStore(() => ({ value: 42 }) as never);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    const { result } = renderHook(
      () =>
        useTypedSelector(
          (state) => (state as unknown as { value: number }).value,
        ),
      { wrapper },
    );

    expect(result.current).toBe(42);
  });
});
