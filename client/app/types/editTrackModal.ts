import { ITrack } from './tracks';

interface EditTrackModalProps {
  track: ITrack;
  isOpen: boolean;
  onClose: () => void;
}

export { type EditTrackModalProps };
