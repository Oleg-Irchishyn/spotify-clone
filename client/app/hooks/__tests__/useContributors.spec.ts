jest.mock('@/app/lib/http', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));

import { renderHook, waitFor } from '@testing-library/react';

import $api from '@/app/lib/http';

import useContributors from '../useContributors';

const mockedApi = $api as jest.Mocked<typeof $api>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useContributors', () => {
  it('starts in a loading state', () => {
    mockedApi.get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useContributors());

    expect(result.current.loading).toBe(true);
    expect(result.current.contributors).toEqual([]);
  });

  it('filters the response to only activated users on success', async () => {
    mockedApi.get.mockResolvedValue({
      data: [
        { _id: '1', email: 'a@test.com', name: 'A', isActivated: true },
        { _id: '2', email: 'b@test.com', name: 'B', isActivated: false },
      ],
    });

    const { result } = renderHook(() => useContributors());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.contributors).toEqual([
      { _id: '1', email: 'a@test.com', name: 'A', isActivated: true },
    ]);
    expect(result.current.error).toBe('');
  });

  it('sets an error message on failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network fail'));

    const { result } = renderHook(() => useContributors());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Network fail');
    expect(result.current.contributors).toEqual([]);
  });

  it('falls back to a generic message for non-Error rejections', async () => {
    mockedApi.get.mockRejectedValue('nope');

    const { result } = renderHook(() => useContributors());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe('Server error');
  });
});
