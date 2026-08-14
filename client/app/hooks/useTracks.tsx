import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../constants/routes';
import { useTypedSelector } from './useTypedSelector';
import { useActions } from './useActions';

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
