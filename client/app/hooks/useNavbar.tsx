import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ROUTES } from '@/app/constants/routes';

const useNavbar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();

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
    router.push(path);
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
    isMenuItemActive,
    handleDrawerOpen,
    handleDrawerClose,
    handleSelectMenuItem,
  };
};

export default useNavbar;
