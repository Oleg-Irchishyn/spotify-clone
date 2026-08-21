import { AlbumAction, AlbumActionTypes, AlbumState } from '@/app/types/albums';

const initialState: AlbumState = {
  albums: [],
  totalCount: 0,
  activeAlbum: null,
  activeAlbumResolved: false,
  loading: true,
  error: '',
};

export const albumsReducer = (
  state = initialState,
  action: AlbumAction,
): AlbumState => {
  switch (action.type) {
    case AlbumActionTypes.FETCH_ALBUMS_START:
      return { ...state, loading: true, error: '' };
    case AlbumActionTypes.FETCH_ALBUMS:
      return {
        ...state,
        loading: false,
        error: '',
        albums: action.payload.albums,
        totalCount: action.payload.totalCount,
      };
    case AlbumActionTypes.FETCH_ALBUMS_ERROR:
      return { ...state, loading: false, error: action.payload };
    case AlbumActionTypes.DELETE_ALBUM:
      return {
        ...state,
        albums: state.albums.filter((album) => album._id !== action.payload),
        totalCount: Math.max(0, state.totalCount - 1),
        activeAlbum:
          state.activeAlbum?._id === action.payload ? null : state.activeAlbum,
      };
    case AlbumActionTypes.UPDATE_ALBUM:
      return {
        ...state,
        albums: state.albums.map((album) =>
          album._id === action.payload._id ? action.payload : album,
        ),
      };
    case AlbumActionTypes.SET_ACTIVE_ALBUM:
      return {
        ...state,
        activeAlbum: action.payload,
        activeAlbumResolved: true,
      };
    default:
      return state;
  }
};
