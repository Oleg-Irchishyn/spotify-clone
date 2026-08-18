import { ChangeEvent } from 'react';

interface TracksPaginationProps {
  page: number;
  pageCount: number;
  onChange: (event: ChangeEvent<unknown>, value: number) => void;
}

export { type TracksPaginationProps };
