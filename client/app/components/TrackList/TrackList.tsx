import { Box, Grid } from '@mui/material';
import { FC } from 'react';

import { PAGE_SIZE } from '@/app/constants/pagination';
import { TrackListProps } from '@/app/types/tracklist';

import TrackItem from '../TrackItem/TrackItem';
import TrackItemSkeleton from '../TrackItemSkeleton/TrackItemSkeleton';
import styles from '../../styles/TrackList.module.scss';

const TrackList: FC<Readonly<TrackListProps>> = ({ tracks, loading }) => {
  return (
    <Grid container className={styles.list_container}>
      <Box className={styles.list_box}>
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <TrackItemSkeleton key={index} />
            ))
          : tracks.map((track) => <TrackItem key={track._id} track={track} />)}
      </Box>
    </Grid>
  );
};

export default TrackList;
