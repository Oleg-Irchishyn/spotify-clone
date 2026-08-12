import { FC } from 'react';
import { TrackItemProps } from '@/app/types/trackItem';
import { Card, Grid, IconButton } from '@mui/material';
import { Delete, Pause, PlayArrow } from '@mui/icons-material';
import Image from 'next/image';

import styles from '../../styles/TrackItem.module.scss';
import useTrack from '@/app/hooks/useTrack';

const TrackItem: FC<TrackItemProps> = ({ track, active = false }) => {
  const { handleTrackDetailsRedirect } = useTrack();
  return (
    <Card className={styles.track} onClick={() => handleTrackDetailsRedirect(track._id)}>
      <IconButton onClick={(e) => e.stopPropagation()}>
        {active ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Image width={70} height={70} src={track.picture} alt={track.name} />
      <Grid container className={styles.track_metadata}>
        <div className={styles.track_name}>{track.name}</div>
        <div className={styles.track_artist}>{track.artist}</div>
      </Grid>
      {active && <div className={styles.track_duration}>02:42 / 03:43</div>}
      <IconButton
        className={styles.track_delete}
        aria-label="delete"
        onClick={(e) => e.stopPropagation()}>
        <Delete />
      </IconButton>
    </Card>
  );
};

export default TrackItem;
