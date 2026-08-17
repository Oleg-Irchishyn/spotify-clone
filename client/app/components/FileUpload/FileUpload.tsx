import { FileUploadProps } from '@/app/types/fileUpload';
import { TextField } from '@mui/material';
import { FC } from 'react';
import useFileUpload from '@/app/hooks/useFileUpload';

const FileUpload: FC<Readonly<FileUploadProps>> = ({ setFile, accept, children }) => {
  const { handleChange } = useFileUpload(setFile);

  return (
    <label>
      {children}
      <TextField
        type="file"
        onChange={handleChange}
        slotProps={{ htmlInput: { accept } }}
        sx={{ display: 'none' }}
      />
    </label>
  );
};

export default FileUpload;
