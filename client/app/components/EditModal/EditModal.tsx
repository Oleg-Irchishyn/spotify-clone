'use client';

import { Box, Modal, Typography } from '@mui/material';
import { FC } from 'react';

import { EditModalProps } from '@/app/types/editModal';

import styles from '../../styles/EditModal.module.scss';

const EditModal: FC<Readonly<EditModalProps>> = ({
  title,
  isOpen,
  onClose,
  children,
}) => {
  return (
    <Modal open={isOpen} onClose={onClose} onClick={(e) => e.stopPropagation()}>
      <Box className={styles.modal_box}>
        <Typography variant="h6" className={styles.modal_title}>
          {title}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export default EditModal;
