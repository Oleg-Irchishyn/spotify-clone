import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AlbumCreationForm from '../AlbumCreationForm';

describe('AlbumCreationForm', () => {
  it('renders the name and author fields with their current values', () => {
    render(
      <AlbumCreationForm
        name={{ value: 'A', onChange: jest.fn(), reset: jest.fn() }}
        author={{ value: 'B', onChange: jest.fn(), reset: jest.fn() }}
      />,
    );

    expect(screen.getByLabelText(/Album Name/)).toHaveValue('A');
    expect(screen.getByLabelText(/Album Author/)).toHaveValue('B');
  });

  it('calls onChange when typing in the name field', async () => {
    const onChange = jest.fn();
    render(
      <AlbumCreationForm
        name={{ value: '', onChange, reset: jest.fn() }}
        author={{ value: '', onChange: jest.fn(), reset: jest.fn() }}
      />,
    );

    await userEvent.type(screen.getByLabelText(/Album Name/), 'x');

    expect(onChange).toHaveBeenCalled();
  });
});
