import { Box, Grid } from '@mui/material';
import { FC } from 'react';

import { TrackListProps } from '@/app/types/tracklist';

import TrackItem from '../TrackItem/TrackItem';

const TrackList: FC<Readonly<TrackListProps>> = ({ tracks }) => {
  return (
    <Grid container sx={{ direction: 'column' }}>
      <Box sx={{ p: 2, width: '100%' }}>
        {tracks.map((track) => (
          <TrackItem key={track._id} track={track} />
        ))}
      </Box>
    </Grid>
  );
};

export default TrackList;
