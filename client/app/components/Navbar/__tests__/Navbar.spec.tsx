jest.mock('@/app/hooks/useNavbar', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@/app/components/ThemeToggle/ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle" />,
}));
jest.mock('@/app/components/ApiDocsLink/ApiDocsLink', () => ({
  __esModule: true,
  default: () => <div data-testid="api-docs-link" />,
}));
jest.mock('@/app/components/LogoutButton/LogoutButton', () => ({
  __esModule: true,
  default: () => <div data-testid="logout-button" />,
}));

import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import useNavbar from '@/app/hooks/useNavbar';

import Navbar from '../Navbar';

const mockedUseNavbar = useNavbar as unknown as jest.Mock;

const baseHook = {
  theme: { direction: 'ltr' },
  open: false,
  drawerRef: { current: null },
  menuItems: [
    { text: 'Main', href: '/', icon: HomeIcon },
    { text: 'Tracklist', href: '/tracks', icon: MusicNoteIcon },
  ],
  isMenuItemActive: (href: string) => href === '/tracks',
  handleDrawerOpen: jest.fn(),
  handleDrawerClose: jest.fn(),
  handleSelectMenuItem: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedUseNavbar.mockReturnValue({ ...baseHook });
});

describe('Navbar', () => {
  it('renders the theme toggle, API docs link, and logout button', () => {
    render(<Navbar />);

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('api-docs-link')).toBeInTheDocument();
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
  });

  it('renders every menu item and marks the active one', () => {
    render(<Navbar />);

    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('Tracklist')).toBeInTheDocument();
    expect(
      screen.getByText('Tracklist').closest('[role="button"]'),
    ).toHaveClass('Mui-selected');
    expect(screen.getByText('Main').closest('[role="button"]')).not.toHaveClass(
      'Mui-selected',
    );
  });

  it('opens the drawer via the menu button', async () => {
    const handleDrawerOpen = jest.fn();
    mockedUseNavbar.mockReturnValue({ ...baseHook, handleDrawerOpen });

    render(<Navbar />);
    await userEvent.click(screen.getByLabelText('open drawer'));

    expect(handleDrawerOpen).toHaveBeenCalled();
  });

  it('selects a menu item, calling handleSelectMenuItem with its route', async () => {
    const handleSelectMenuItem = jest.fn();
    mockedUseNavbar.mockReturnValue({ ...baseHook, handleSelectMenuItem });

    render(<Navbar />);
    await userEvent.click(screen.getByText('Main'));

    expect(handleSelectMenuItem).toHaveBeenCalledWith('/');
  });

  it('closes the drawer from the header chevron', async () => {
    const handleDrawerClose = jest.fn();
    mockedUseNavbar.mockReturnValue({ ...baseHook, handleDrawerClose });

    render(<Navbar />);
    await userEvent.click(
      screen.getByTestId('ChevronLeftIcon').closest('button')!,
    );

    expect(handleDrawerClose).toHaveBeenCalled();
  });

  it('shows the right-pointing chevron for rtl direction', () => {
    mockedUseNavbar.mockReturnValue({
      ...baseHook,
      theme: { direction: 'rtl' },
    });

    render(<Navbar />);

    expect(screen.getByTestId('ChevronRightIcon')).toBeInTheDocument();
  });
});
