import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import TracksPagination from '../TracksPagination';

describe('TracksPagination', () => {
  it('renders the given page count and current page', () => {
    render(<TracksPagination page={2} pageCount={5} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('calls onChange when a different page is selected', async () => {
    const onChange = jest.fn();
    render(<TracksPagination page={1} pageCount={3} onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(onChange).toHaveBeenCalled();
  });
});
