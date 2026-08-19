'use client';

import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';

import styles from '../../styles/BackButton.module.scss';

const BackButton = () => {
  const router = useRouter();

  return (
    <IconButton
      aria-label="go back"
      onClick={() => router.back()}
      className={styles.back_button}
    >
      <ArrowBack />
    </IconButton>
  );
};

export default BackButton;
