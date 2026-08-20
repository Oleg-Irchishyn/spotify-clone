import { render, screen } from '@testing-library/react';

import AppBar from '../AppBar';

describe('AppBar', () => {
  it('renders its children when closed', () => {
    render(
      <AppBar open={false}>
        <div>content</div>
      </AppBar>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('renders its children when open', () => {
    render(
      <AppBar open>
        <div>content</div>
      </AppBar>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
