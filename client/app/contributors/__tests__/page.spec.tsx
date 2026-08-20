jest.mock('@/app/components/ContributorsView/ContributorsView', () => ({
  __esModule: true,
  default: () => <div data-testid="contributors-view" />,
}));

import { render, screen } from '@testing-library/react';

import ContributorsPage from '../page';

describe('Contributors page', () => {
  it('renders ContributorsView', () => {
    render(<ContributorsPage />);

    expect(screen.getByTestId('contributors-view')).toBeInTheDocument();
  });
});
