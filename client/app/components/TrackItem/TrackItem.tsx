import { Delete, Edit, Pause, PlayArrow, Repeat } from '@mui/icons-material';
import { Card, Grid, IconButton, Tooltip } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import useTextOverflow from '@/app/hooks/useTextOverflow';
import useTrack from '@/app/hooks/useTrack';
import ConfirmDialog from '@/app/components/ConfirmDialog/ConfirmDialog';
import EditModal from '@/app/components/EditModal/EditModal';
import EditTrackForm from '@/app/components/EditTrackForm/EditTrackForm';
import { formatTime } from '@/app/utils/formatTime';
import { TrackItemProps } from '@/app/types/trackItem';

import styles from '../../styles/TrackItem.module.scss';

const TrackItem: FC<Readonly<TrackItemProps>> = ({ track }) => {
  const {
    handleTrackDetailsRedirect,
    handlePlay,
    isActivated,
    isActive,
    isPlaying,
    currentTime,
    duration,
    loop,
    handleToggleLoop,
    isDeleteConfirmOpen,
    isDeleting,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isEditOpen,
    handleEditOpen,
    handleEditClose,
  } = useTrack(track);
  const { ref: nameRef, isOverflowing: isNameOverflowing } =
    useTextOverflow<HTMLDivElement>(track.name);
  const { ref: artistRef, isOverflowing: isArtistOverflowing } =
    useTextOverflow<HTMLDivElement>(track.artist);

  return (
    <Card className={styles.track} onClick={handleTrackDetailsRedirect}>
      <div className={styles.track_main}>
        <IconButton onClick={handlePlay}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Image
          width={70}
          height={70}
          quality={90}
          src={track.picture}
          alt={track.name}
          className={styles.track_image}
        />
        <Grid container className={styles.track_metadata}>
          <Tooltip title={track.name} disableHoverListener={!isNameOverflowing}>
            <div ref={nameRef} className={styles.track_name}>
              {track.name}
            </div>
          </Tooltip>
          <Tooltip
            title={track.artist}
            disableHoverListener={!isArtistOverflowing}
          >
            <div ref={artistRef} className={styles.track_artist}>
              {track.artist}
            </div>
          </Tooltip>
        </Grid>
        {isActive && (
          <div className={styles.track_duration}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>
      <Grid className={styles.track_actions}>
        <IconButton
          aria-label="repeat"
          onClick={handleToggleLoop}
          color={isActive && loop ? 'primary' : 'default'}
          disabled={!isActive}
        >
          <Repeat />
        </IconButton>
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
        title="Delete track"
        description={`Are you sure you want to delete "${track.name}"? This action cannot be undone.`}
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <EditModal
        title="Edit Track"
        isOpen={isEditOpen}
        onClose={handleEditClose}
      >
        <EditTrackForm track={track} onClose={handleEditClose} />
      </EditModal>
    </Card>
  );
};

export default TrackItem;
