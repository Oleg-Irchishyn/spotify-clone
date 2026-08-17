import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';

import { useActions } from './useActions';
import { useTypedSelector } from './useTypedSelector';
import { ROUTES } from '../constants/routes';

const PAGE_SIZE = 4;

const useTracks = () => {
  const router = useRouter();
  const { tracks, totalCount, error } = useTypedSelector(
    (state) => state.tracks,
  );
  const { fetchTracks } = useActions();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTracks(PAGE_SIZE, (page - 1) * PAGE_SIZE);
  }, [fetchTracks, page]);

  const handleTrackUpload = () => {
    router.push(ROUTES.TRACK_UPLOAD);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return {
    tracks,
    error,
    handleTrackUpload,
    page,
    pageCount,
    handlePageChange,
  };
};

export default useTracks;
