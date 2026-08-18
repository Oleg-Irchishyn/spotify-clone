import { Grid, TextField } from '@mui/material';
import { FC } from 'react';

import { TrackCreationFormProps } from '@/app/types/trackCreationForm';

import styles from '../../styles/TrackCreationForm.module.scss';

const TrackCreationForm: FC<Readonly<TrackCreationFormProps>> = ({
  name,
  artist,
  text,
}) => {
  return (
    <Grid container className={styles.form_container}>
      <TextField
        value={name.value}
        onChange={name.onChange}
        label="Track Name"
      />
      <TextField
        value={artist.value}
        onChange={artist.onChange}
        label="Track Artist"
      />
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
