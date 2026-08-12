import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useNavbar = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

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

  return {
    theme,
    open,
    handleDrawerOpen,
    handleDrawerClose,
    handleSelectMenuItem,
  };
};

export default useNavbar;
