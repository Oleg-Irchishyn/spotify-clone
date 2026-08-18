import { Delete, Edit, Pause, PlayArrow, Repeat } from '@mui/icons-material';
import { Card, Grid, IconButton } from '@mui/material';
import Image from 'next/image';
import { FC } from 'react';

import useTrack from '@/app/hooks/useTrack';
import ConfirmDialog from '@/app/components/ConfirmDialog/ConfirmDialog';
import EditTrackModal from '@/app/components/EditTrackModal/EditTrackModal';
import { formatTime } from '@/app/utils/formatTime';
import { TrackItemProps } from '@/app/types/trackItem';

import styles from '../../styles/TrackItem.module.scss';

const TrackItem: FC<Readonly<TrackItemProps>> = ({ track }) => {
  const {
    handleTrackDetailsRedirect,
    handlePlay,
    isActive,
    isPlaying,
    currentTime,
    duration,
    loop,
    handleToggleLoop,
    isDeleteConfirmOpen,
    handleDeleteClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    isEditOpen,
    handleEditOpen,
    handleEditClose,
  } = useTrack(track);
  return (
    <Card className={styles.track} onClick={handleTrackDetailsRedirect}>
      <IconButton onClick={handlePlay}>
        {isPlaying ? <Pause /> : <PlayArrow />}
      </IconButton>
      <Image width={70} height={70} src={track.picture} alt={track.name} />
      <Grid container className={styles.track_metadata}>
        <div className={styles.track_name}>{track.name}</div>
        <div className={styles.track_artist}>{track.artist}</div>
      </Grid>
      {isActive && (
        <div className={styles.track_duration}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      )}
      <Grid className={styles.track_actions}>
        <IconButton
          aria-label="repeat"
          onClick={handleToggleLoop}
          color={loop ? 'primary' : 'default'}
        >
          <Repeat />
        </IconButton>
        <IconButton aria-label="edit" onClick={handleEditOpen}>
          <Edit />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleDeleteClick}>
          <Delete />
        </IconButton>
      </Grid>
      <ConfirmDialog
        open={isDeleteConfirmOpen}
        title="Delete track"
        description={`Are you sure you want to delete "${track.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
      <EditTrackModal
        track={track}
        isOpen={isEditOpen}
        onClose={handleEditClose}
      />
    </Card>
  );
};

export default TrackItem;
