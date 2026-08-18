import { ChangeEvent } from 'react';

import { IAlbum } from './albums';
import { InputField } from './input';

interface TrackCreationFormProps {
  name: InputField;
  artist: InputField;
  text: InputField;
  albumId: string;
  onAlbumChange: (e: ChangeEvent<HTMLInputElement>) => void;
  albums: IAlbum[];
}

export { type TrackCreationFormProps };
