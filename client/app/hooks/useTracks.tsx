import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useActions } from './useActions';
import { useTypedSelector } from './useTypedSelector';
import { ROUTES } from '../constants/routes';

const useTracks = () => {
  const router = useRouter();
  const { tracks, error } = useTypedSelector((state) => state.tracks);
  const { fetchTracks } = useActions();

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const handleTrackUpload = () => {
    router.push(ROUTES.TRACK_UPLOAD);
  };

  return {
    tracks,
    error,
    handleTrackUpload,
  };
};

export default useTracks;
