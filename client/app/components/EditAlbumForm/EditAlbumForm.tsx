'use client';

import { FC } from 'react';

import useEditAlbum from '@/app/hooks/useEditAlbum';
import EditForm from '@/app/components/EditForm/EditForm';
import { EditAlbumFormProps } from '@/app/types/editAlbumForm';
import { EditFieldConfig } from '@/app/types/editForm';

const EditAlbumForm: FC<Readonly<EditAlbumFormProps>> = ({
  album,
  onClose,
}) => {
  const { name, author, picture, setPicture, handleSubmit } = useEditAlbum(
    album,
    onClose,
  );

  const fields: EditFieldConfig[] = [
    { type: 'text', name: 'name', label: 'Album Name', ...name },
    { type: 'text', name: 'author', label: 'Album Author', ...author },
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
    <EditForm fields={fields} onSubmit={handleSubmit} onCancel={onClose} />
  );
};

export default EditAlbumForm;
