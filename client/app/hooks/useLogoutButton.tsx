import { usePathname, useRouter } from 'next/navigation';
import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useAuth from './useAuth';
import { ROUTES } from '../constants/routes';

const useLogoutButton = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isActivated } = useAuth();
  const { logout } = useActions();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleLogoutClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  const handleConfirm = () => {
    logout();
    setIsConfirmOpen(false);
    if (pathname !== ROUTES.HOME) {
      router.push(ROUTES.HOME);
    }
  };

  return {
    isActivated,
    isConfirmOpen,
    handleLogoutClick,
    handleCancel,
    handleConfirm,
  };
};

export default useLogoutButton;
