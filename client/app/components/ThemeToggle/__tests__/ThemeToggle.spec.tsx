jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useColorScheme: jest.fn(),
}));

import { useColorScheme } from '@mui/material/styles';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ThemeToggle from '../ThemeToggle';

const mockedUseColorScheme = useColorScheme as jest.Mock;

describe('ThemeToggle', () => {
  it('toggles to light mode when currently dark', async () => {
    const setMode = jest.fn();
    mockedUseColorScheme.mockReturnValue({ mode: 'dark', setMode });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'toggle theme' });
    expect(button).not.toBeDisabled();

    await userEvent.click(button);

    expect(setMode).toHaveBeenCalledWith('light');
  });

  it('toggles to dark mode when currently light', async () => {
    const setMode = jest.fn();
    mockedUseColorScheme.mockReturnValue({ mode: 'light', setMode });

    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole('button', { name: 'toggle theme' }));

    expect(setMode).toHaveBeenCalledWith('dark');
  });
});
