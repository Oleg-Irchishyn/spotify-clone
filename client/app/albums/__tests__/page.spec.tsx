jest.mock('@/app/components/AlbumsView/AlbumsView', () => ({
  __esModule: true,
  default: () => <div data-testid="albums-view" />,
}));

import { render, screen } from '@testing-library/react';

import AlbumsPage from '../page';

describe('Albums page', () => {
  it('renders AlbumsView', () => {
    render(<AlbumsPage />);

    expect(screen.getByTestId('albums-view')).toBeInTheDocument();
  });
});
