'use client';

import { Link, Typography } from '@mui/material';

import useHome from '@/app/hooks/useHome';
import AuthForm from '@/app/components/AuthForm/AuthForm';
import EditModal from '@/app/components/EditModal/EditModal';
import Loader from '@/app/components/Loader/Loader';

import styles from '../../styles/Home.module.scss';

const HomeView = () => {
  const {
    showAuthBanner,
    authLoading,
    authMode,
    openAuthModal,
    closeAuthModal,
  } = useHome();

  return (
    <main>
      <div className="center">
        <Typography className={styles.title} variant="h1" component="h1">
          Welcome!
        </Typography>
        <Typography className={styles.subtitle} variant="h5" component="h2">
          Best tracks are gathered here!
        </Typography>
        {authLoading ? (
          <Loader />
        ) : (
          showAuthBanner && (
            <Typography className={styles.auth_banner} variant="body1">
              Please{' '}
              <Link
                component="button"
                type="button"
                onClick={() => openAuthModal('registration')}
              >
                register
              </Link>
              /
              <Link
                component="button"
                type="button"
                onClick={() => openAuthModal('login')}
              >
                login
              </Link>{' '}
              if you want to see list of other users, upload and edit albums and
              tracks.
            </Typography>
          )
        )}
      </div>
      {authMode && (
        <EditModal
          title={authMode === 'login' ? 'Login' : 'Registration'}
          isOpen
          onClose={closeAuthModal}
        >
          <AuthForm
            mode={authMode}
            onModeChange={openAuthModal}
            onClose={closeAuthModal}
          />
        </EditModal>
      )}
    </main>
  );
};

export default HomeView;
