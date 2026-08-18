'use client';

import { Button, Grid, TextField } from '@mui/material';
import { FC } from 'react';

import useEditTrack from '@/app/hooks/useEditTrack';
import FileUpload from '@/app/components/FileUpload/FileUpload';
import { EditTrackFormProps } from '@/app/types/editTrackForm';

import styles from '../../styles/EditTrackForm.module.scss';

const EditTrackForm: FC<Readonly<EditTrackFormProps>> = ({
  track,
  onClose,
}) => {
  const {
    name,
    artist,
    text,
    picture,
    setPicture,
    audio,
    setAudio,
    handleSubmit,
  } = useEditTrack(track, onClose);

  return (
    <Grid
      container
      component="form"
      onSubmit={handleSubmit}
      className={styles.form}
    >
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
      <FileUpload file={picture} setFile={setPicture} accept="image/*">
        <Button component="span">Change Image</Button>
      </FileUpload>
      <FileUpload file={audio} setFile={setAudio} accept="audio/*">
        <Button component="span">Change Audio</Button>
      </FileUpload>
      <Grid container className={styles.form_actions}>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditTrackForm;
