'use client';

import { FC } from 'react';

import { TrackProgressProps } from '@/app/types/trackProgress';
import { Grid, TextField, Typography } from '@mui/material';

import styles from '../../styles/Player.module.scss';

const TrackProgress: FC<TrackProgressProps> = ({ left, right, onChange }) => {
  return (
    <Grid sx={{ display: 'flex' }}>
      <TextField
        type="range"
        className={styles.track_progress_input}
        value={left}
        onChange={onChange}
        slotProps={{ htmlInput: { min: 0, max: right } }}
      />
      <Typography className={styles.track_progress_numbers} variant="body2">
        {left} / {right}
      </Typography>
    </Grid>
  );
};

export default TrackProgress;
