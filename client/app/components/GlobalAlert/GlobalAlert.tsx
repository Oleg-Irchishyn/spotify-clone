'use client';

import { FC } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTypedSelector } from '@/app/hooks/useTypedSelector';
import { useActions } from '@/app/hooks/useActions';

const GlobalAlert: FC = () => {
  const { message, severity, open } = useTypedSelector((state) => state.alert);
  const { hideAlert } = useActions();

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={hideAlert}>
      <Alert onClose={hideAlert} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalAlert;
