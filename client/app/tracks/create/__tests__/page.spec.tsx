jest.mock('@/app/components/CreateTrackView/CreateTrackView', () => ({
  __esModule: true,
  default: () => <div data-testid="create-track-view" />,
}));

import { render, screen } from '@testing-library/react';

import CreateTrackPage from '../page';

describe('Create track page', () => {
  it('renders CreateTrackView', () => {
    render(<CreateTrackPage />);

    expect(screen.getByTestId('create-track-view')).toBeInTheDocument();
  });
});
