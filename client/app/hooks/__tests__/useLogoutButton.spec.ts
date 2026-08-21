jest.mock('../useActions', () => ({
  useActions: jest.fn(),
}));
jest.mock('../useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';

import { useActions } from '../useActions';
import useAuth from '../useAuth';
import useLogoutButton from '../useLogoutButton';

const mockedUseActions = useActions as jest.Mock;
const mockedUseAuth = useAuth as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;

describe('useLogoutButton', () => {
  const logout = jest.fn();
  const stopPropagation = jest.fn();
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseActions.mockReturnValue({ logout });
    mockedUseAuth.mockReturnValue({ isActivated: true });
    mockedUseRouter.mockReturnValue({ push });
    mockedUsePathname.mockReturnValue('/tracks');
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

  it('handleConfirm logs out, closes the confirmation, and redirects home', () => {
    const { result } = renderHook(() => useLogoutButton());

    act(() => {
      result.current.handleLogoutClick({ stopPropagation } as never);
    });
    act(() => result.current.handleConfirm());

    expect(logout).toHaveBeenCalled();
    expect(result.current.isConfirmOpen).toBe(false);
    expect(push).toHaveBeenCalledWith('/');
  });

  it('handleConfirm does not redirect when already on the home page', () => {
    mockedUsePathname.mockReturnValue('/');
    const { result } = renderHook(() => useLogoutButton());

    act(() => {
      result.current.handleLogoutClick({ stopPropagation } as never);
    });
    act(() => result.current.handleConfirm());

    expect(logout).toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
  });
});
