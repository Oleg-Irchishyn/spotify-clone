interface IComment {
  _id: string;
  username: string;
  text: string;
}

interface ITrack {
  _id: string;
  name: string;
  artist: string;
  text: string;
  listens: number;
  audio: string;
  picture: string;
  comments: IComment[];
}

interface TrackState {
  tracks: ITrack[];
  totalCount: number;
  error: string;
}

enum TrackActionTypes {
  FETCH_TRACKS = 'FETCH_TRACKS',
  FETCH_TRACKS_ERROR = 'FETCH_TRACKS_ERROR',
  DELETE_TRACK = 'DELETE_TRACK',
  UPDATE_TRACK = 'UPDATE_TRACK',
}

interface FetchTracksAction {
  type: TrackActionTypes.FETCH_TRACKS;
  payload: { tracks: ITrack[]; totalCount: number };
}

interface FetchTracksErrorAction {
  type: TrackActionTypes.FETCH_TRACKS_ERROR;
  payload: string;
}

interface DeleteTrackAction {
  type: TrackActionTypes.DELETE_TRACK;
  payload: string;
}

interface UpdateTrackAction {
  type: TrackActionTypes.UPDATE_TRACK;
  payload: ITrack;
}

type TrackAction =
  | FetchTracksAction
  | FetchTracksErrorAction
  | DeleteTrackAction
  | UpdateTrackAction;

export {
  type ITrack,
  type IComment,
  TrackActionTypes,
  type TrackState,
  type TrackAction,
};
