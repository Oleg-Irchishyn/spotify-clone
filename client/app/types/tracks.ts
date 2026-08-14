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
  error: string;
}

enum TrackActionTypes {
  FETCH_TRACKS = 'FETCH_TRACKS',
  FETCH_TRACKS_ERROR = 'FETCH_TRACKS_ERROR',
}

interface FetchTracksAction {
  type: TrackActionTypes.FETCH_TRACKS;
  payload: ITrack[];
}

interface FetchTracksErrorAction {
  type: TrackActionTypes.FETCH_TRACKS_ERROR;
  payload: string;
}

type TrackAction = FetchTracksAction | FetchTracksErrorAction;

export { type ITrack, type IComment, TrackActionTypes, type TrackState, type TrackAction };
