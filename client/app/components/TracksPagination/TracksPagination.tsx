'use client';

import { Grid, Pagination } from '@mui/material';
import { FC } from 'react';

import { TracksPaginationProps } from '@/app/types/tracksPagination';

import styles from '../../styles/TracksPagination.module.scss';

const TracksPagination: FC<Readonly<TracksPaginationProps>> = ({
  page,
  pageCount,
  onChange,
}) => {
  return (
    <Grid className={styles.pagination_wrapper}>
      <Pagination count={pageCount} page={page} onChange={onChange} />
    </Grid>
  );
};

export default TracksPagination;
