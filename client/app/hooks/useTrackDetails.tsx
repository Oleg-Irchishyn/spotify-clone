import { useRouter } from 'next/navigation';
import { ROUTES } from '../constants/routes';
import { ITrack } from '../types/tracks';

const useTrackDetails = () => {
  const router = useRouter();

  const track: ITrack = {
    _id: '6a7c6d87b4e286bc5258c3e0',
    name: 'Track 1',
    artist: 'Track 1 artist',
    text: 'Random text',
    listens: 0,
    audio: 'http://localhost:5000/audio/3d390ae6-6631-4678-b05e-48677055fa6d.mp3',
    picture: 'http://localhost:5000/image/ccf6cb76-5aa4-49e2-b60f-fd5276df28d1.jpg',
    comments: [
      { _id: '6a7590b7d7df3f35611c8e7a', username: 'John Doe', text: 'Great track!' },
      { _id: '6a759163831675a9db501ebc', username: 'Jane Smith', text: 'Love this one!' },
    ],
  };

  const handleRedirectToTracks = () => {
    router.push(ROUTES.TRACKS);
  };

  return {
    handleRedirectToTracks,
    track,
  };
};

export default useTrackDetails;
