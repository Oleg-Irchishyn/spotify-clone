import { ReactNode } from 'react';

interface FileUploadProps {
  file?: File;
  setFile: (file: File) => void;
  accept?: string;
  children?: ReactNode;
}

export { type FileUploadProps };
