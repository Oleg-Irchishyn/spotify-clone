jest.mock('../useAuth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import { act, renderHook } from '@testing-library/react';

import useAuth from '../useAuth';
import useHome from '../useHome';

const mockedUseAuth = useAuth as unknown as jest.Mock;

describe('useHome', () => {
  it('shows the auth banner when not loading and not activated', () => {
    mockedUseAuth.mockReturnValue({ isActivated: false, loading: false });

    const { result } = renderHook(() => useHome());

    expect(result.current.showAuthBanner).toBe(true);
  });

  it('hides the auth banner while the auth check is loading', () => {
    mockedUseAuth.mockReturnValue({ isActivated: false, loading: true });

    const { result } = renderHook(() => useHome());

    expect(result.current.showAuthBanner).toBe(false);
  });

  it('exposes authLoading so the view can render a loading state', () => {
    mockedUseAuth.mockReturnValue({ isActivated: false, loading: true });

    const { result } = renderHook(() => useHome());

    expect(result.current.authLoading).toBe(true);
  });

  it('hides the auth banner when the user is activated', () => {
    mockedUseAuth.mockReturnValue({ isActivated: true, loading: false });

    const { result } = renderHook(() => useHome());

    expect(result.current.showAuthBanner).toBe(false);
  });

  it('opens and closes the auth modal with the requested mode', () => {
    mockedUseAuth.mockReturnValue({ isActivated: false, loading: false });

    const { result } = renderHook(() => useHome());
    expect(result.current.authMode).toBeNull();

    act(() => {
      result.current.openAuthModal('registration');
    });
    expect(result.current.authMode).toBe('registration');

    act(() => {
      result.current.closeAuthModal();
    });
    expect(result.current.authMode).toBeNull();
  });
});
