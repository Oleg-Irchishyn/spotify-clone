'use client';

import { Grid, TextField, Typography } from '@mui/material';
import { FC } from 'react';

import { formatTime } from '@/app/utils/formatTime';
import { TrackProgressProps } from '@/app/types/trackProgress';

import styles from '../../styles/Player.module.scss';

const TrackProgress: FC<Readonly<TrackProgressProps>> = ({
  left,
  right,
  onChange,
  formatAsTime = false,
  step = 'any',
}) => {
  const leftLabel = formatAsTime ? formatTime(left) : left;
  const rightLabel = formatAsTime ? formatTime(right) : right;

  return (
    <Grid className={styles.progress_row}>
      <TextField
        type="range"
        className={styles.track_progress_input}
        value={left}
        onChange={onChange}
        slotProps={{ htmlInput: { min: 0, max: right, step } }}
      />
      <Typography className={styles.track_progress_numbers} variant="body2">
        {leftLabel} / {rightLabel}
      </Typography>
    </Grid>
  );
};

export default TrackProgress;
