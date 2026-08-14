import { ChangeEvent, useState } from 'react';

const useTrackCreationForm = (initialValue: string) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  return { value, onChange };
};

export default useTrackCreationForm;
