jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';

import { useActions } from '../useActions';
import useAuth from '../useAuth';
import useLogoutButton from '../useLogoutButton';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as unknown as jest.Mock;

describe('useLogoutButton', () => {
  const logout = jest.fn();
  const stopPropagation = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ logout });
    mockedUseAuth.mockReturnValue({ isActivated: true });
  });

  it('exposes isActivated from useAuth', () => {
    const { result } = renderHook(() => useLogoutButton());

    expect(result.current.isActivated).toBe(true);
  });

  it('handleLogoutClick opens the confirmation and stops propagation', () => {
    const { result } = renderHook(() => useLogoutButton());

    act(() => {
      result.current.handleLogoutClick({ stopPropagation } as never);
    });

    expect(stopPropagation).toHaveBeenCalled();
    expect(result.current.isConfirmOpen).toBe(true);
  });

  it('handleCancel closes the confirmation without logging out', () => {
    const { result } = renderHook(() => useLogoutButton());

    act(() => {
      result.current.handleLogoutClick({ stopPropagation } as never);
    });
    act(() => result.current.handleCancel());

    expect(result.current.isConfirmOpen).toBe(false);
    expect(logout).not.toHaveBeenCalled();
  });

  it('handleConfirm logs out and closes the confirmation', () => {
    const { result } = renderHook(() => useLogoutButton());

    act(() => {
      result.current.handleLogoutClick({ stopPropagation } as never);
    });
    act(() => result.current.handleConfirm());

    expect(logout).toHaveBeenCalled();
    expect(result.current.isConfirmOpen).toBe(false);
  });
});
