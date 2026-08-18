'use client';

import { FC } from 'react';

import useEditTrack from '@/app/hooks/useEditTrack';
import EditForm from '@/app/components/EditForm/EditForm';
import { EditFieldConfig } from '@/app/types/editForm';
import { EditTrackFormProps } from '@/app/types/editTrackForm';

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
    albumId,
    handleAlbumChange,
    albums,
    handleSubmit,
  } = useEditTrack(track, onClose);

  const fields: EditFieldConfig[] = [
    { type: 'text', name: 'name', label: 'Track Name', ...name },
    { type: 'text', name: 'artist', label: 'Track Artist', ...artist },
    {
      type: 'text',
      name: 'text',
      label: 'Track Lyrics',
      multiline: true,
      rows: 3,
      ...text,
    },
    {
      type: 'select',
      name: 'album',
      label: 'Album',
      value: albumId,
      onChange: handleAlbumChange,
      options: [
        { value: '', label: 'None' },
        ...albums.map((album) => ({ value: album._id, label: album.name })),
      ],
    },
    {
      type: 'file',
      name: 'picture',
      label: 'Change Image',
      accept: 'image/*',
      file: picture,
      setFile: setPicture,
    },
    {
      type: 'file',
      name: 'audio',
      label: 'Change Audio',
      accept: 'audio/*',
      file: audio,
      setFile: setAudio,
    },
  ];

  return <EditForm fields={fields} onSubmit={handleSubmit} onCancel={onClose} />;
};

export default EditTrackForm;
