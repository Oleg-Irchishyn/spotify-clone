'use client';

import { Pause, PlayArrow, VolumeOff, VolumeUp } from '@mui/icons-material';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { FC } from 'react';

import usePlayer from '@/app/hooks/usePlayer';
import useTextOverflow from '@/app/hooks/useTextOverflow';

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
    muted,
    handleToggleMute,
  } = usePlayer();
  const { ref: nameRef, isOverflowing: isNameOverflowing } =
    useTextOverflow<HTMLDivElement>(active?.name ?? '');
  const { ref: artistRef, isOverflowing: isArtistOverflowing } =
    useTextOverflow<HTMLDivElement>(active?.artist ?? '');

  if (!active) {
    return null;
  }
  return (
    <div className={styles.player}>
      <IconButton onClick={hanlePlay}>
        {pause ? <PlayArrow /> : <Pause />}
      </IconButton>
      <Grid container className={styles.track_info}>
        <Tooltip title={active.name} disableHoverListener={!isNameOverflowing}>
          <div ref={nameRef} className={trackStyles.track_name}>
            {active.name}
          </div>
        </Tooltip>
        <Tooltip
          title={active.artist}
          disableHoverListener={!isArtistOverflowing}
        >
          <div ref={artistRef} className={trackStyles.track_artist}>
            {active.artist}
          </div>
        </Tooltip>
      </Grid>
      <div className={styles.main_progress}>
        <TrackProgress
          left={progress}
          right={duration}
          onChange={handleProgressChange}
          formatAsTime
        />
      </div>
      <div className={styles.volume_control}>
        <IconButton
          onClick={handleToggleMute}
          className={styles.volume_toggle}
          size="small"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <VolumeOff className={styles.volume_icon} />
          ) : (
            <VolumeUp className={styles.volume_icon} />
          )}
        </IconButton>
        <TrackProgress
          left={muted ? 0 : volume}
          right={100}
          onChange={handleVolumeChange}
          step={1}
        />
      </div>
    </div>
  );
};

export default Player;
