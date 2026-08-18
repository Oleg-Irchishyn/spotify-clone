import { ChangeEvent } from 'react';

interface SearchProps {
  query: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export { type SearchProps };
