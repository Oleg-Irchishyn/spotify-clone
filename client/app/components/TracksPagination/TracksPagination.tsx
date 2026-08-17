'use client';

import { Grid, Pagination } from '@mui/material';
import { ChangeEvent, FC } from 'react';

interface TracksPaginationProps {
  page: number;
  pageCount: number;
  onChange: (event: ChangeEvent<unknown>, value: number) => void;
}

const TracksPagination: FC<Readonly<TracksPaginationProps>> = ({
  page,
  pageCount,
  onChange,
}) => {
  return (
    <Grid sx={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <Pagination count={pageCount} page={page} onChange={onChange} />
    </Grid>
  );
};

export default TracksPagination;
