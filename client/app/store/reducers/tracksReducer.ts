import { TrackAction, TrackActionTypes, TrackState } from '@/app/types/tracks';

const initialState: TrackState = {
  tracks: [],
  totalCount: 0,
  error: '',
};

export const tracksReducer = (
  state = initialState,
  action: TrackAction,
): TrackState => {
  switch (action.type) {
    case TrackActionTypes.FETCH_TRACKS:
      return {
        error: '',
        tracks: action.payload.tracks,
        totalCount: action.payload.totalCount,
      };
    case TrackActionTypes.FETCH_TRACKS_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
