jest.mock('../action-creators/auth', () => ({
  fetchCurrentUser: jest.fn(),
}));

import { render, screen } from '@testing-library/react';

import { fetchCurrentUser } from '../action-creators/auth';
import StoreProvider from '../StoreProvider';

const mockedFetchCurrentUser = fetchCurrentUser as jest.Mock;

describe('StoreProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchCurrentUser.mockReturnValue(async () => {});
  });

  it('renders its children inside the redux Provider', () => {
    render(
      <StoreProvider>
        <div>child content</div>
      </StoreProvider>,
    );

    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('dispatches fetchCurrentUser once on mount', () => {
    render(
      <StoreProvider>
        <div>child</div>
      </StoreProvider>,
    );

    expect(mockedFetchCurrentUser).toHaveBeenCalledTimes(1);
  });
});
