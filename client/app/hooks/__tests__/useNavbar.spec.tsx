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

import { ROUTES } from '@/app/constants/routes';

import useAuth from '../useAuth';
import useNavbar from '../useNavbar';

const mockedUseAuth = useAuth as unknown as jest.Mock;
const mockedUseRouter = useRouter as jest.Mock;
const mockedUsePathname = usePathname as jest.Mock;

describe('useNavbar', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseRouter.mockReturnValue({ push });
    mockedUsePathname.mockReturnValue(ROUTES.HOME);
    mockedUseAuth.mockReturnValue({ isActivated: false });
  });

  it('hides the Contributors item when not activated', () => {
    const { result } = renderHook(() => useNavbar());

    expect(
      result.current.menuItems.some(
        (item) => item.href === ROUTES.CONTRIBUTORS,
      ),
    ).toBe(false);
  });

  it('shows the Contributors item when activated', () => {
    mockedUseAuth.mockReturnValue({ isActivated: true });

    const { result } = renderHook(() => useNavbar());

    expect(
      result.current.menuItems.some(
        (item) => item.href === ROUTES.CONTRIBUTORS,
      ),
    ).toBe(true);
  });

  it('isMenuItemActive matches the home route exactly', () => {
    mockedUsePathname.mockReturnValue(ROUTES.HOME);
    const { result } = renderHook(() => useNavbar());

    expect(result.current.isMenuItemActive(ROUTES.HOME)).toBe(true);
    expect(result.current.isMenuItemActive(ROUTES.TRACKS)).toBe(false);
  });

  it('isMenuItemActive matches nested routes for non-home items', () => {
    mockedUsePathname.mockReturnValue(`${ROUTES.TRACKS}/create`);
    const { result } = renderHook(() => useNavbar());

    expect(result.current.isMenuItemActive(ROUTES.TRACKS)).toBe(true);
  });

  it('does not treat the home route as active for other paths', () => {
    mockedUsePathname.mockReturnValue(ROUTES.TRACKS);
    const { result } = renderHook(() => useNavbar());

    expect(result.current.isMenuItemActive(ROUTES.HOME)).toBe(false);
  });

  it('opens and closes the drawer', () => {
    const { result } = renderHook(() => useNavbar());
    expect(result.current.open).toBe(false);

    act(() => result.current.handleDrawerOpen());
    expect(result.current.open).toBe(true);

    act(() => result.current.handleDrawerClose());
    expect(result.current.open).toBe(false);
  });

  it('handleSelectMenuItem navigates and closes the drawer', () => {
    const { result } = renderHook(() => useNavbar());

    act(() => result.current.handleDrawerOpen());
    act(() => result.current.handleSelectMenuItem(ROUTES.TRACKS));

    expect(push).toHaveBeenCalledWith(ROUTES.TRACKS);
    expect(result.current.open).toBe(false);
  });

  it('closes the drawer on an outside click while open', () => {
    const { result } = renderHook(() => useNavbar());

    act(() => result.current.handleDrawerOpen());
    expect(result.current.open).toBe(true);

    const drawer = document.createElement('div');
    const outside = document.createElement('div');
    document.body.appendChild(drawer);
    document.body.appendChild(outside);
    result.current.drawerRef.current = drawer;

    act(() => {
      outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(result.current.open).toBe(false);
    document.body.removeChild(drawer);
    document.body.removeChild(outside);
  });

  it('does not close the drawer on a click inside it', () => {
    const { result } = renderHook(() => useNavbar());

    act(() => result.current.handleDrawerOpen());

    const inside = document.createElement('div');
    document.body.appendChild(inside);
    result.current.drawerRef.current = inside;

    act(() => {
      inside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(result.current.open).toBe(true);
    document.body.removeChild(inside);
  });
});
