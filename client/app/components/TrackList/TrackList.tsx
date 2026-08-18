import { Box, Grid } from '@mui/material';
import { FC } from 'react';

import { TrackListProps } from '@/app/types/tracklist';

import TrackItem from '../TrackItem/TrackItem';
import styles from '../../styles/TrackList.module.scss';

const TrackList: FC<Readonly<TrackListProps>> = ({ tracks }) => {
  return (
    <Grid container className={styles.list_container}>
      <Box className={styles.list_box}>
        {tracks.map((track) => (
          <TrackItem key={track._id} track={track} />
        ))}
      </Box>
    </Grid>
  );
};

export default TrackList;
