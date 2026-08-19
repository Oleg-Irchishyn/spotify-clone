import { Grid, MenuItem, TextField } from '@mui/material';
import { FC } from 'react';

import {
  TRACK_ARTIST_MAX_LENGTH,
  TRACK_LYRICS_MAX_LENGTH,
  TRACK_NAME_MAX_LENGTH,
} from '@/app/constants/validation';
import { TrackCreationFormProps } from '@/app/types/trackCreationForm';

import styles from '../../styles/TrackCreationForm.module.scss';

const TrackCreationForm: FC<Readonly<TrackCreationFormProps>> = ({
  name,
  artist,
  text,
  albumId,
  onAlbumChange,
  albums,
}) => {
  return (
    <Grid container className={styles.form_container}>
      <TextField
        value={name.value}
        onChange={name.onChange}
        label="Track Name"
        helperText={`${name.value.length}/${TRACK_NAME_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: TRACK_NAME_MAX_LENGTH } }}
      />
      <TextField
        value={artist.value}
        onChange={artist.onChange}
        label="Track Artist"
        helperText={`${artist.value.length}/${TRACK_ARTIST_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: TRACK_ARTIST_MAX_LENGTH } }}
      />
      <TextField
        value={text.value}
        onChange={text.onChange}
        label="Track Lyrics"
        multiline
        rows={3}
        helperText={`${text.value.length}/${TRACK_LYRICS_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: TRACK_LYRICS_MAX_LENGTH } }}
      />
      <TextField select value={albumId} onChange={onAlbumChange} label="Album">
        <MenuItem value="">None</MenuItem>
        {albums.map((album) => (
          <MenuItem key={album._id} value={album._id}>
            {album.name}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
};

export default TrackCreationForm;
