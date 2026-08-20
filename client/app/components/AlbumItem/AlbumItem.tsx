import { Delete, Edit } from '@mui/icons-material';
import { Card, Grid, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import useAlbumItem from '@/app/hooks/useAlbumItem';
import useTextOverflow from '@/app/hooks/useTextOverflow';
import ConfirmDialog from '@/app/components/ConfirmDialog/ConfirmDialog';
import EditAlbumForm from '@/app/components/EditAlbumForm/EditAlbumForm';
import EditModal from '@/app/components/EditModal/EditModal';
import { AlbumItemProps } from '@/app/types/albumItem';

import styles from '../../styles/AlbumItem.module.scss';

const AlbumItem: FC<Readonly<AlbumItemProps>> = ({ album }) => {
  const {
    handleAlbumOpen,
    isActivated,
    isDeleteConfirmOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isEditOpen,
    handleEditOpen,
    handleEditClose,
  } = useAlbumItem(album);
  const { ref: nameRef, isOverflowing: isNameOverflowing } =
    useTextOverflow<HTMLDivElement>(album.name);
  const { ref: authorRef, isOverflowing: isAuthorOverflowing } =
    useTextOverflow<HTMLDivElement>(album.author);

  return (
    <Card className={styles.album} onClick={handleAlbumOpen}>
      <div className={styles.album_main}>
        <Image
          width={70}
          height={70}
          quality={90}
          src={album.picture}
          alt={album.name}
          className={styles.album_image}
        />
        <Grid container className={styles.album_metadata}>
          <Tooltip title={album.name} disableHoverListener={!isNameOverflowing}>
            <div ref={nameRef} className={styles.album_name}>
              {album.name}
            </div>
          </Tooltip>
          <Tooltip
            title={album.author}
            disableHoverListener={!isAuthorOverflowing}
          >
            <div ref={authorRef} className={styles.album_author}>
              {album.author}
            </div>
          </Tooltip>
        </Grid>
      </div>
      <Grid className={styles.album_actions}>
        {isActivated && (
          <>
            <IconButton aria-label="edit" onClick={handleEditOpen}>
              <Edit />
            </IconButton>
            <IconButton aria-label="delete" onClick={handleDeleteClick}>
              <Delete />
            </IconButton>
          </>
        )}
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
