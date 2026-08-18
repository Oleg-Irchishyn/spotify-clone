import { Grid, TextField } from '@mui/material';
import { FC } from 'react';

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
      />
      <TextField
        value={author.value}
        onChange={author.onChange}
        label="Album Author"
      />
    </Grid>
  );
};

export default AlbumCreationForm;
