jest.mock('@/app/components/CreateAlbumView/CreateAlbumView', () => ({
  __esModule: true,
  default: () => <div data-testid="create-album-view" />,
}));

import { render, screen } from '@testing-library/react';

import CreateAlbumPage from '../page';

describe('Create album page', () => {
  it('renders CreateAlbumView', () => {
    render(<CreateAlbumPage />);

    expect(screen.getByTestId('create-album-view')).toBeInTheDocument();
  });
});
