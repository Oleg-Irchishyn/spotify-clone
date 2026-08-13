import { FC } from 'react';
import { Grid, TextField } from '@mui/material';

const TrackCreationForm: FC = () => {
  return (
    <Grid container sx={{ flexDirection: 'column', padding: '20px', gap: '10px' }}>
      <TextField label="Track Name" />
      <TextField label="Track Artist" />
      <TextField label="Track Lyrics" multiline rows={3} />
    </Grid>
  );
};

export default TrackCreationForm;
