'use client';

import { FC } from 'react';
import { Pause, PlayArrow, VolumeUp } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';

import usePlayer from '@/app/hooks/usePlayer';

import styles from '../../styles/Player.module.scss';
import trackStyles from '../../styles/TrackItem.module.scss';

import TrackProgress from '../TrackProgess/TrackProgress';

const Player: FC = () => {
  const { active, track, progress, handleProgressChange, volume, handleVolumeChange } = usePlayer();
  return (
    <div className={styles.player}>
      <IconButton onClick={(e) => e.stopPropagation()}>
        {active ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Grid container className={trackStyles.track_metadata}>
        <div className={trackStyles.track_name}>{track.name}</div>
        <div className={trackStyles.track_artist}>{track.artist}</div>
      </Grid>
      <TrackProgress left={progress} right={100} onChange={handleProgressChange} />
      <VolumeUp sx={{ marginLeft: 'auto' }} />
      <TrackProgress left={volume} right={100} onChange={handleVolumeChange} />
    </div>
  );
};

export default Player;
