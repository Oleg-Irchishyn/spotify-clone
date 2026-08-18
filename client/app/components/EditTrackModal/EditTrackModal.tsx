'use client';

import { Box, Modal, Typography } from '@mui/material';
import { FC } from 'react';

import EditTrackForm from '@/app/components/EditTrackForm/EditTrackForm';
import { EditTrackModalProps } from '@/app/types/editTrackModal';

import styles from '../../styles/EditTrackModal.module.scss';

const EditTrackModal: FC<Readonly<EditTrackModalProps>> = ({
  track,
  isOpen,
  onClose,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box onClick={(e) => e.stopPropagation()} className={styles.modal_box}>
        <Typography variant="h6" className={styles.modal_title}>
          Edit Track
        </Typography>
        <EditTrackForm track={track} onClose={onClose} />
      </Box>
    </Modal>
  );
};

export default EditTrackModal;
