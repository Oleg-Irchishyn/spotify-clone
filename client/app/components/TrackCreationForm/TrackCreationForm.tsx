import { FC } from 'react';
import { Grid, TextField } from '@mui/material';
import { TrackCreationFormProps } from '@/app/types/trackCreationForm';

const TrackCreationForm: FC<Readonly<TrackCreationFormProps>> = ({ name, artist, text }) => {
  return (
    <Grid container sx={{ flexDirection: 'column', padding: '20px', gap: '10px' }}>
      <TextField value={name.value} onChange={name.onChange} label="Track Name" />
      <TextField value={artist.value} onChange={artist.onChange} label="Track Artist" />
      <TextField
        value={text.value}
        onChange={text.onChange}
        label="Track Lyrics"
        multiline
        rows={3}
      />
    </Grid>
  );
};

export default TrackCreationForm;
