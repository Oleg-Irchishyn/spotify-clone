import { Grid, TextField } from '@mui/material';
import { FC } from 'react';

import {
  ALBUM_AUTHOR_MAX_LENGTH,
  ALBUM_NAME_MAX_LENGTH,
} from '@/app/constants/validation';
import { AlbumCreationFormProps } from '@/app/types/albumCreationForm';

import styles from '../../styles/AlbumCreationForm.module.scss';

const AlbumCreationForm: FC<Readonly<AlbumCreationFormProps>> = ({
  name,
  author,
}) => {
  return (
    <Grid container className={styles.form_container}>
      <TextField
        value={name.value}
        onChange={name.onChange}
        label="Album Name"
        helperText={`${name.value.length}/${ALBUM_NAME_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: ALBUM_NAME_MAX_LENGTH } }}
      />
      <TextField
        value={author.value}
        onChange={author.onChange}
        label="Album Author"
        helperText={`${author.value.length}/${ALBUM_AUTHOR_MAX_LENGTH}`}
        slotProps={{ htmlInput: { maxLength: ALBUM_AUTHOR_MAX_LENGTH } }}
      />
    </Grid>
  );
};

export default AlbumCreationForm;
