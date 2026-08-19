import { ChangeEvent } from 'react';

interface SearchProps {
  query: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export { type SearchProps };
