import { useRouter } from 'next/navigation';
import { ROUTES } from '../constants/routes';

const useTrack = () => {
  const router = useRouter();

  const handleTrackDetailsRedirect = (id: string) => {
    router.push(ROUTES.TRACK_DETAILS(id));
  };

  return {
    handleTrackDetailsRedirect,
  };
};

export default useTrack;
