import { FC } from 'react';
import { Grid, TextField } from '@mui/material';
import { TrackCreationFormProps } from '@/app/types/trackCreationForm';

const TrackCreationForm: FC<TrackCreationFormProps> = ({ name, artist, text }) => {
  return (
    <Grid container sx={{ flexDirection: 'column', padding: '20px', gap: '10px' }}>
      <TextField {...name} label="Track Name" />
      <TextField {...artist} label="Track Artist" />
      <TextField {...text} label="Track Lyrics" multiline rows={3} />
    </Grid>
  );
};

export default TrackCreationForm;
