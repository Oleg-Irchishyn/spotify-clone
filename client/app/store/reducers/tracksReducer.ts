import { TrackAction, TrackActionTypes, TrackState } from '@/app/types/tracks';

const initialState: TrackState = {
  tracks: [],
  totalCount: 0,
  loading: true,
  error: '',
};

export const tracksReducer = (
  state = initialState,
  action: TrackAction,
): TrackState => {
  switch (action.type) {
    case TrackActionTypes.FETCH_TRACKS_START:
      return { ...state, loading: true, error: '' };
    case TrackActionTypes.FETCH_TRACKS:
      return {
        loading: false,
        error: '',
        tracks: action.payload.tracks,
        totalCount: action.payload.totalCount,
      };
    case TrackActionTypes.FETCH_TRACKS_ERROR:
      return { ...state, loading: false, error: action.payload };
    case TrackActionTypes.DELETE_TRACK:
      return {
        ...state,
        tracks: state.tracks.filter((track) => track._id !== action.payload),
        totalCount: Math.max(0, state.totalCount - 1),
      };
    case TrackActionTypes.UPDATE_TRACK:
      return {
        ...state,
        tracks: state.tracks.map((track) =>
          track._id === action.payload._id ? action.payload : track,
        ),
      };
    default:
      return state;
  }
};
