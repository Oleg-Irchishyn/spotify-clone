'use client';

import { Pause, PlayArrow, VolumeUp } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';
import { FC } from 'react';

import usePlayer from '@/app/hooks/usePlayer';

import TrackProgress from '../TrackProgess/TrackProgress';
import styles from '../../styles/Player.module.scss';
import trackStyles from '../../styles/TrackItem.module.scss';

const Player: FC = () => {
  const {
    pause,
    active,
    progress,
    duration,
    hanlePlay,
    handleProgressChange,
    volume,
    handleVolumeChange,
  } = usePlayer();

  if (!active) {
    return null;
  }
  return (
    <div className={styles.player}>
      <IconButton onClick={hanlePlay}>
        {pause ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Grid container className={trackStyles.track_metadata}>
        <div className={trackStyles.track_name}>{active?.name}</div>
        <div className={trackStyles.track_artist}>{active?.artist}</div>
      </Grid>
      <TrackProgress
        left={progress}
        right={duration}
        onChange={handleProgressChange}
        formatAsTime
      />
      <VolumeUp sx={{ marginLeft: 'auto' }} />
      <TrackProgress left={volume} right={100} onChange={handleVolumeChange} />
    </div>
  );
};

export default Player;
