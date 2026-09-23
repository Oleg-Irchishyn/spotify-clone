import { Album } from 'src/album/schemas/album.schema';
import { Track } from 'src/track/schemas/track.schema';

export interface PaginatedTracks {
  tracks: Track[];
  totalCount: number;
}

export interface PaginatedAlbums {
  albums: Album[];
  totalCount: number;
}
