import { ChangeEvent } from 'react';

const useFileUpload = (setFile: (file: File) => void) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return { handleChange };
};

export default useFileUpload;
