'use client';

import { Button, Grid, MenuItem, TextField } from '@mui/material';
import { FC } from 'react';

import FileUpload from '@/app/components/FileUpload/FileUpload';
import { EditFormProps } from '@/app/types/editForm';

import styles from '../../styles/EditForm.module.scss';

const EditForm: FC<Readonly<EditFormProps>> = ({
  fields,
  onSubmit,
  onCancel,
  isSaveDisabled,
}) => {
  return (
    <Grid
      container
      component="form"
      onSubmit={onSubmit}
      className={styles.form}
    >
      {fields.map((field) => {
        if (field.type === 'file') {
          return (
            <FileUpload
              key={field.name}
              file={field.file}
              setFile={field.setFile}
              accept={field.accept}
            >
              <Button component="span">{field.label}</Button>
            </FileUpload>
          );
        }

        if (field.type === 'select') {
          return (
            <TextField
              key={field.name}
              select
              value={field.value}
              onChange={field.onChange}
              label={field.label}
            >
              {field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          );
        }

        return (
          <TextField
            key={field.name}
            value={field.value}
            onChange={field.onChange}
            label={field.label}
            multiline={field.multiline}
            rows={field.rows}
            helperText={
              field.maxLength
                ? `${field.value.length}/${field.maxLength}`
                : undefined
            }
            slotProps={
              field.maxLength
                ? { htmlInput: { maxLength: field.maxLength } }
                : undefined
            }
          />
        );
      })}
      <Grid container className={styles.form_actions}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" disabled={isSaveDisabled}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditForm;
