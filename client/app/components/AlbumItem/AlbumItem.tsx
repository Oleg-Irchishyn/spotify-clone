import { Delete, Edit } from '@mui/icons-material';
import { Card, Grid, IconButton } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import useAlbumItem from '@/app/hooks/useAlbumItem';
import ConfirmDialog from '@/app/components/ConfirmDialog/ConfirmDialog';
import EditAlbumForm from '@/app/components/EditAlbumForm/EditAlbumForm';
import EditModal from '@/app/components/EditModal/EditModal';
import { AlbumItemProps } from '@/app/types/albumItem';

import styles from '../../styles/AlbumItem.module.scss';

const AlbumItem: FC<Readonly<AlbumItemProps>> = ({ album }) => {
  const {
    handleAlbumOpen,
    isDeleteConfirmOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isEditOpen,
    handleEditOpen,
    handleEditClose,
  } = useAlbumItem(album);

  return (
    <Card className={styles.album} onClick={handleAlbumOpen}>
      <Image width={70} height={70} src={album.picture} alt={album.name} />
      <Grid container className={styles.album_metadata}>
        <div className={styles.album_name}>{album.name}</div>
        <div className={styles.album_author}>{album.author}</div>
      </Grid>
      <Grid className={styles.album_actions}>
        <IconButton aria-label="edit" onClick={handleEditOpen}>
          <Edit />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteClick}>
          <Delete />
        </IconButton>
      </Grid>
      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="Delete album"
        description={`Are you sure you want to delete "${album.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <EditModal
        title="Edit Album"
        isOpen={isEditOpen}
        onClose={handleEditClose}
      >
        <EditAlbumForm album={album} onClose={handleEditClose} />
      </EditModal>
    </Card>
  );
};

export default AlbumItem;
