jest.mock('@/app/components/HomeView/HomeView', () => ({
  __esModule: true,
  default: () => <div data-testid="home-view" />,
}));

import { render, screen } from '@testing-library/react';

import Home from '../page';

describe('Home page', () => {
  it('renders HomeView', () => {
    render(<Home />);

    expect(screen.getByTestId('home-view')).toBeInTheDocument();
  });
});
