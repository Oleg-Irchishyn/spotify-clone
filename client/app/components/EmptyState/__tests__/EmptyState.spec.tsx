import { render, screen } from '@testing-library/react';

import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('renders the given message', () => {
    render(<EmptyState message="No tracks found." />);

    expect(screen.getByText('No tracks found.')).toBeInTheDocument();
  });
});
