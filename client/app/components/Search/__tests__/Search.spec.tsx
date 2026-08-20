import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Search from '../Search';

describe('Search', () => {
  it('renders the given query value', () => {
    render(<Search query="hello" onChange={jest.fn()} />);

    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('uses the default placeholder when none is given', () => {
    render(<Search query="" onChange={jest.fn()} />);

    expect(screen.getByPlaceholderText('Search Tracks...')).toBeInTheDocument();
  });

  it('uses a custom placeholder when given', () => {
    render(
      <Search query="" onChange={jest.fn()} placeholder="Search Albums..." />,
    );

    expect(screen.getByPlaceholderText('Search Albums...')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = jest.fn();
    render(<Search query="" onChange={onChange} />);

    await userEvent.type(screen.getByRole('textbox'), 'a');

    expect(onChange).toHaveBeenCalled();
  });
});
