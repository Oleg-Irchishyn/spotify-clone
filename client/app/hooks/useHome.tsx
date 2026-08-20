import { useState } from 'react';

import useAuth from './useAuth';
import { AuthMode } from '../types/auth';

const useHome = () => {
  const { isActivated, loading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  const showAuthBanner = !loading && !isActivated;

  const openAuthModal = (mode: AuthMode) => {
    setAuthMode(mode);
  };

  const closeAuthModal = () => {
    setAuthMode(null);
  };

  return { showAuthBanner, authMode, openAuthModal, closeAuthModal };
};

export default useHome;
