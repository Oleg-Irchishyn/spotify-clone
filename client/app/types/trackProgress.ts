import { ChangeEvent } from 'react';

interface TrackProgressProps {
  left: number;
  right: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export { type TrackProgressProps };
