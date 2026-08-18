import { ChangeEvent } from 'react';

interface AlbumsPaginationProps {
  page: number;
  pageCount: number;
  onChange: (event: ChangeEvent<unknown>, value: number) => void;
}

export { type AlbumsPaginationProps };
