import { Typography } from '@mui/material';
import { FC } from 'react';

import { EmptyStateProps } from '@/app/types/emptyState';

import styles from '../../styles/EmptyState.module.scss';

const EmptyState: FC<Readonly<EmptyStateProps>> = ({ message }) => {
  return (
    <div className={styles.empty_state}>
      <Typography variant="body1" className={styles.message}>
        {message}
      </Typography>
    </div>
  );
};

export default EmptyState;
