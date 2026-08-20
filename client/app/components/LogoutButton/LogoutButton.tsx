'use client';

import { Logout } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import useLogoutButton from '@/app/hooks/useLogoutButton';
import ConfirmDialog from '@/app/components/ConfirmDialog/ConfirmDialog';

import styles from '../../styles/LogoutButton.module.scss';

const LogoutButton = () => {
  const {
    isActivated,
    isConfirmOpen,
    handleLogoutClick,
    handleCancel,
    handleConfirm,
  } = useLogoutButton();

  if (!isActivated) {
    return null;
  }

  return (
    <>
      <IconButton
        aria-label="logout"
        onClick={handleLogoutClick}
        color="inherit"
        className={styles.logout_button}
      >
        <Logout />
      </IconButton>
      <ConfirmDialog
        open={isConfirmOpen}
        title="Log out"
        description="Are you sure you want to log out?"
        confirmLabel="Log out"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
};

export default LogoutButton;
