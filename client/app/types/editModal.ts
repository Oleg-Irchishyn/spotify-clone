import { ReactNode } from 'react';

interface EditModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export { type EditModalProps };
