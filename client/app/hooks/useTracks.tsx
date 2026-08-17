import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useActions } from './useActions';
import { useTypedSelector } from './useTypedSelector';
import { ROUTES } from '../constants/routes';

const PAGE_SIZE = 4;
const SEARCH_DEBOUNCE_MS = 500;

const useTracks = () => {
  const router = useRouter();
  const { tracks, totalCount, error } = useTypedSelector(
    (state) => state.tracks,
  );
  const { fetchTracks, searchTracks } = useActions();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const offset = (page - 1) * PAGE_SIZE;
    if (debouncedQuery) {
      searchTracks(debouncedQuery, PAGE_SIZE, offset);
    } else {
      fetchTracks(PAGE_SIZE, offset);
    }
  }, [fetchTracks, searchTracks, debouncedQuery, page]);

  const handleTrackUpload = () => {
    router.push(ROUTES.TRACK_UPLOAD);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setDebouncedQuery(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handlePageChange = (_event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return {
    tracks,
    error,
    handleTrackUpload,
    query,
    handleSearch,
    page,
    pageCount,
    handlePageChange,
  };
};

export default useTracks;
