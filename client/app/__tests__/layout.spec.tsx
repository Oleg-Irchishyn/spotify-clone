jest.mock('../store/StoreProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('../components/Navbar/Navbar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar" />,
}));
jest.mock('../components/Player/Player', () => ({
  __esModule: true,
  default: () => <div data-testid="player" />,
}));
jest.mock('../components/GlobalAlert/GlobalAlert', () => ({
  __esModule: true,
  default: () => <div data-testid="global-alert" />,
}));

import { render, screen } from '@testing-library/react';

import RootLayout, { metadata, viewport } from '../layout';

describe('RootLayout', () => {
  it('renders the app shell and the page children', () => {
    // Rendering the root <html>/<body> outside a full document triggers a
    // (harmless, expected) DOM-nesting warning - silence it for a clean run.
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <RootLayout params={Promise.resolve({})}>
        <div data-testid="page-content" />
      </RootLayout>,
    );

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('player')).toBeInTheDocument();
    expect(screen.getByTestId('global-alert')).toBeInTheDocument();
    expect(screen.getByTestId('page-content')).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('exports the expected metadata and viewport', () => {
    expect(metadata.title).toBe('Spotify Clone Application');
    expect(viewport.width).toBe('device-width');
  });
});
