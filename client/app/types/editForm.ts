import { ChangeEvent, Dispatch, FormEventHandler, SetStateAction } from 'react';

interface EditTextFieldConfig {
  type: 'text';
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  rows?: number;
}

interface EditFileFieldConfig {
  type: 'file';
  name: string;
  label: string;
  accept: string;
  file: File | undefined;
  setFile: Dispatch<SetStateAction<File | undefined>>;
}

interface EditSelectOption {
  value: string;
  label: string;
}

interface EditSelectFieldConfig {
  type: 'select';
  name: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  options: EditSelectOption[];
}

type EditFieldConfig =
  EditTextFieldConfig | EditFileFieldConfig | EditSelectFieldConfig;

interface EditFormProps {
  fields: EditFieldConfig[];
  onSubmit: FormEventHandler;
  onCancel: () => void;
}

export {
  type EditFieldConfig,
  type EditTextFieldConfig,
  type EditFileFieldConfig,
  type EditSelectFieldConfig,
  type EditSelectOption,
  type EditFormProps,
};
