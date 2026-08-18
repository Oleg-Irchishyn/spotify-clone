import { TextField } from '@mui/material';
import { FC } from 'react';

import useFileUpload from '@/app/hooks/useFileUpload';
import { FileUploadProps } from '@/app/types/fileUpload';

import styles from '../../styles/FileUpload.module.scss';

const FileUpload: FC<Readonly<FileUploadProps>> = ({
  setFile,
  accept,
  children,
}) => {
  const { handleChange } = useFileUpload(setFile);

  return (
    <label>
      {children}
      <TextField
        type="file"
        onChange={handleChange}
        slotProps={{ htmlInput: { accept } }}
        className={styles.hidden_input}
      />
    </label>
  );
};

export default FileUpload;
