import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { useActions } from './useActions';
import useAuth from './useAuth';
import { useTypedSelector } from './useTypedSelector';
import { PAGE_SIZE } from '../constants/pagination';
import { ROUTES } from '../constants/routes';
import { SEARCH_DEBOUNCE_MS } from '../constants/search';

const useAlbums = () => {
  const router = useRouter();
  const { isActivated } = useAuth();
  const { albums, totalCount, loading, error } = useTypedSelector(
    (state) => state.albums,
  );
  const { fetchAlbums } = useActions();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pageCount = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Deleting the last item(s) on a page shrinks pageCount synchronously
  // (via the redux reducer) without a refetch, so step back to the new
  // last page instead of showing that now-empty page.
  if (!loading && page > pageCount) {
    setPage(pageCount);
  }

  useEffect(() => {
    if (page > pageCount) {
      return;
    }

    const offset = (page - 1) * PAGE_SIZE;
    fetchAlbums(debouncedQuery, PAGE_SIZE, offset);
  }, [fetchAlbums, debouncedQuery, page, pageCount]);

  const handleAlbumUpload = () => {
    router.push(ROUTES.ALBUM_UPLOAD);
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

  return {
    albums,
    loading,
    error,
    isActivated,
    handleAlbumUpload,
    query,
    handleSearch,
    page,
    pageCount,
    handlePageChange,
  };
};

export default useAlbums;
