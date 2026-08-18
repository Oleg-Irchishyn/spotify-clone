import { CircularProgress } from '@mui/material';
import { FC } from 'react';

import { LoaderProps } from '@/app/types/loader';

import styles from '../../styles/Loader.module.scss';

const Loader: FC<Readonly<LoaderProps>> = ({ fullScreen = false }) => {
  return (
    <div className={fullScreen ? styles.full_screen : styles.inline}>
      <CircularProgress />
    </div>
  );
};

export default Loader;
