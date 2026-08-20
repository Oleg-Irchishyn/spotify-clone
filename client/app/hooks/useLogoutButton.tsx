import { SyntheticEvent, useState } from 'react';

import { useActions } from './useActions';
import useAuth from './useAuth';

const useLogoutButton = () => {
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
