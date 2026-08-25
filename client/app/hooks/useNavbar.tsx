import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { menuItems } from '@/app/constants/navigation';
import { ROUTES } from '@/app/constants/routes';

import useAuth from './useAuth';

const useNavbar = () => {
  const theme = useTheme();
  const { isActivated } = useAuth();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  const visibleMenuItems = menuItems.filter(
    (item) => item.href !== ROUTES.CONTRIBUTORS || isActivated,
  );

  const isMenuItemActive = (href: string) =>
    href === ROUTES.HOME
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSelectMenuItem = (path: string) => {
    if (path !== pathname) {
      router.push(path);
    }
    handleDrawerClose();
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        handleDrawerClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return {
    theme,
    open,
    drawerRef,
    menuItems: visibleMenuItems,
    isMenuItemActive,
    handleDrawerOpen,
    handleDrawerClose,
    handleSelectMenuItem,
  };
};

export default useNavbar;
