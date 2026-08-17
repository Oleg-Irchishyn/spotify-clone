import { Delete, Pause, PlayArrow } from '@mui/icons-material';
import { Card, Grid, IconButton } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import useTrack from '@/app/hooks/useTrack';
import { formatTime } from '@/app/utils/formatTime';
import { TrackItemProps } from '@/app/types/trackItem';

import styles from '../../styles/TrackItem.module.scss';

const TrackItem: FC<Readonly<TrackItemProps>> = ({ track }) => {
  const {
    handleTrackDetailsRedirect,
    handlePlay,
    isActive,
    isPlaying,
    currentTime,
    duration,
  } = useTrack(track);
  return (
    <Card className={styles.track} onClick={handleTrackDetailsRedirect}>
      <IconButton onClick={handlePlay}>
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Image width={70} height={70} src={track.picture} alt={track.name} />
      <Grid container className={styles.track_metadata}>
        <div className={styles.track_name}>{track.name}</div>
        <div className={styles.track_artist}>{track.artist}</div>
      </Grid>
      {isActive && (
        <div className={styles.track_duration}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
      <IconButton
        className={styles.track_delete}
        aria-label="delete"
        onClick={(e) => e.stopPropagation()}
      >
        <Delete />
      </IconButton>
    </Card>
  );
};

export default TrackItem;
