'use client';

import { FC } from 'react';

import useEditAlbum from '@/app/hooks/useEditAlbum';
import EditForm from '@/app/components/EditForm/EditForm';
import {
  ALBUM_AUTHOR_MAX_LENGTH,
  ALBUM_NAME_MAX_LENGTH,
} from '@/app/constants/validation';
import { EditAlbumFormProps } from '@/app/types/editAlbumForm';
import { EditFieldConfig } from '@/app/types/editForm';

const EditAlbumForm: FC<Readonly<EditAlbumFormProps>> = ({
  album,
  onClose,
}) => {
  const { name, author, picture, setPicture, isDirty, isSaving, handleSubmit } =
    useEditAlbum(album, onClose);

  const fields: EditFieldConfig[] = [
    {
      type: 'text',
      name: 'name',
      label: 'Album Name',
      maxLength: ALBUM_NAME_MAX_LENGTH,
      ...name,
    },
    {
      type: 'text',
      name: 'author',
      label: 'Album Author',
      maxLength: ALBUM_AUTHOR_MAX_LENGTH,
      ...author,
    },
    {
      type: 'file',
      name: 'picture',
      label: 'Change Image',
      accept: 'image/*',
      file: picture,
      setFile: setPicture,
    },
  ];

  return (
    <EditForm
      fields={fields}
      onSubmit={handleSubmit}
      onCancel={onClose}
      isSaveDisabled={!isDirty}
      loading={isSaving}
    />
  );
};

export default EditAlbumForm;
