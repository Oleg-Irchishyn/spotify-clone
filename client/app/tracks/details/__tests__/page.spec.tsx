jest.mock('@/app/components/TrackDetailsView/TrackDetailsContent', () => ({
  __esModule: true,
  default: () => <div data-testid="track-details-content" />,
}));

import { render, screen } from '@testing-library/react';

import TrackDetailsPage from '../page';

describe('Track details page', () => {
  it('renders TrackDetailsContent inside a Suspense boundary', () => {
    render(<TrackDetailsPage />);

    expect(screen.getByTestId('track-details-content')).toBeInTheDocument();
  });
});
