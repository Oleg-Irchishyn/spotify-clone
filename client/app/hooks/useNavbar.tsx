import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const useNavbar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

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
    handleDrawerOpen,
    handleDrawerClose,
    handleSelectMenuItem,
  };
};

export default useNavbar;
