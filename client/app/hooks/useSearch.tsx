import { ChangeEvent, useRef, useState } from 'react';

import { useActions } from './useActions';

const useSearch = () => {
  const [query, setQuery] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { searchTracks } = useActions();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      searchTracks(value);
    }, 500);
  };

  return { query, handleSearch };
};

export default useSearch;
