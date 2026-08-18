'use client';

import { Grid, Pagination } from '@mui/material';
import { FC } from 'react';

import { AlbumsPaginationProps } from '@/app/types/albumsPagination';

import styles from '../../styles/AlbumsPagination.module.scss';

const AlbumsPagination: FC<Readonly<AlbumsPaginationProps>> = ({
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

export default AlbumsPagination;
