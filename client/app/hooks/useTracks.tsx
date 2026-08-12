import { useRouter } from 'next/navigation';
import { ROUTES } from '../constants/routes';
import { ITrack } from '../types/tracks';

const useTracks = () => {
  const router = useRouter();

  const tracks: ITrack[] = [
    {
      _id: '6a7c6d87b4e286bc5258c3e0',
      name: 'Track 1',
      artist: 'Track 1 artist',
      text: 'Random text',
      listens: 0,
      audio: 'http://localhost:5000/audio/3d390ae6-6631-4678-b05e-48677055fa6d.mp3',
      picture: 'http://localhost:5000/image/ccf6cb76-5aa4-49e2-b60f-fd5276df28d1.jpg',
      comments: [],
    },
    {
      _id: '6a7c6db0b4e286bc5258c3e1',
      name: 'Track 2',
      artist: 'Track 2 artist',
      text: 'Random text',
      listens: 0,
      audio: 'http://localhost:5000/audio/a1f0a5c8-2bc4-465c-b643-e1d65774335b.mp3',
      picture: 'http://localhost:5000/image/ed9e0d45-7d2c-4bd1-a2f8-597e57dd2aa3.jpg',
      comments: [],
    },
    {
      _id: '6a7c6db9b4e286bc5258c3e2',
      name: 'Track 3',
      artist: 'Track 3 artist',
      text: 'Random text',
      listens: 2,
      audio: 'http://localhost:5000/audio/c24c2ade-8b15-4e2b-a0da-7fc9f19cd9d6.mp3',
      picture: 'http://localhost:5000/image/d5745e35-dd21-4fca-89b8-cf188205ae3c.jpg',
      comments: [],
    },
    {
      _id: '6a7c6dc1b4e286bc5258c3e3',
      name: 'Track 4',
      artist: 'Track 4 artist',
      text: 'Random text',
      listens: 0,
      audio: 'http://localhost:5000/audio/8b047a84-6b03-4f0e-9e9c-878b5feee4d2.mp3',
      picture: 'http://localhost:5000/image/afeacca7-e096-47c0-af4d-721b2834b7d0.jpg',
      comments: [],
    },
  ];

  const handleTrackUpload = () => {
    router.push(ROUTES.TRACK_UPLOAD);
  };

  return {
    tracks,
    handleTrackUpload,
  };
};

export default useTracks;
