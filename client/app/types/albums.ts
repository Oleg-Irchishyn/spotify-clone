interface IAlbum {
  _id: string;
  name: string;
  author: string;
  picture: string;
}

interface AlbumState {
  albums: IAlbum[];
  totalCount: number;
  activeAlbum: IAlbum | null;
  activeAlbumResolved: boolean;
  loading: boolean;
  error: string;
}

enum AlbumActionTypes {
  FETCH_ALBUMS_START = 'FETCH_ALBUMS_START',
  FETCH_ALBUMS = 'FETCH_ALBUMS',
  FETCH_ALBUMS_ERROR = 'FETCH_ALBUMS_ERROR',
  DELETE_ALBUM = 'DELETE_ALBUM',
  UPDATE_ALBUM = 'UPDATE_ALBUM',
  SET_ACTIVE_ALBUM = 'SET_ACTIVE_ALBUM',
}

interface FetchAlbumsStartAction {
  type: AlbumActionTypes.FETCH_ALBUMS_START;
}

interface FetchAlbumsAction {
  type: AlbumActionTypes.FETCH_ALBUMS;
  payload: { albums: IAlbum[]; totalCount: number };
}

interface FetchAlbumsErrorAction {
  type: AlbumActionTypes.FETCH_ALBUMS_ERROR;
  payload: string;
}

interface DeleteAlbumAction {
  type: AlbumActionTypes.DELETE_ALBUM;
  payload: string;
}

interface UpdateAlbumAction {
  type: AlbumActionTypes.UPDATE_ALBUM;
  payload: IAlbum;
}

interface SetActiveAlbumAction {
  type: AlbumActionTypes.SET_ACTIVE_ALBUM;
  payload: IAlbum | null;
}

type AlbumAction =
  | FetchAlbumsStartAction
  | FetchAlbumsAction
  | FetchAlbumsErrorAction
  | DeleteAlbumAction
  | UpdateAlbumAction
  | SetActiveAlbumAction;

export { type IAlbum, AlbumActionTypes, type AlbumState, type AlbumAction };
