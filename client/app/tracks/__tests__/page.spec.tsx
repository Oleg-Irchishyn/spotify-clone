jest.mock('@/app/components/TracksView/TracksView', () => ({
  __esModule: true,
  default: () => <div data-testid="tracks-view" />,
}));

import { render, screen } from '@testing-library/react';

import TracksPage from '../page';

describe('Tracks page', () => {
  it('renders TracksView', () => {
    render(<TracksPage />);

    expect(screen.getByTestId('tracks-view')).toBeInTheDocument();
  });
});
