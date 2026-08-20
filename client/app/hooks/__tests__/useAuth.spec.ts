jest.mock('../useTypedSelector', () => ({
  useTypedSelector: jest.fn(),
}));

import useAuth from '../useAuth';
import { useTypedSelector } from '../useTypedSelector';

const mockedUseTypedSelector = useTypedSelector as unknown as jest.Mock;

describe('useAuth', () => {
  it('reports isActivated as false when there is no user', () => {
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({ auth: { user: null, loading: false } }),
    );

    const result = useAuth();

    expect(result).toEqual({ user: null, loading: false, isActivated: false });
  });

  it('reports isActivated as false when the user is not activated', () => {
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: { email: 'a@test.com', name: 'A', isActivated: false },
          loading: false,
        },
      }),
    );

    expect(useAuth().isActivated).toBe(false);
  });

  it('reports isActivated as true when the user is activated', () => {
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({
        auth: {
          user: { email: 'a@test.com', name: 'A', isActivated: true },
          loading: false,
        },
      }),
    );

    const result = useAuth();

    expect(result.isActivated).toBe(true);
    expect(result.user).toEqual({
      email: 'a@test.com',
      name: 'A',
      isActivated: true,
    });
  });

  it('exposes the loading flag', () => {
    mockedUseTypedSelector.mockImplementation((selector) =>
      selector({ auth: { user: null, loading: true } }),
    );

    expect(useAuth().loading).toBe(true);
  });
});
