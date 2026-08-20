import { render, screen } from '@testing-library/react';

import DrawerHeader from '../DrawerHeader';

describe('DrawerHeader', () => {
  it('renders its children', () => {
    render(
      <DrawerHeader>
        <div>content</div>
      </DrawerHeader>,
    );

    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
