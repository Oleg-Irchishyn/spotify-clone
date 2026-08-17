import { Dispatch } from 'redux';
import $api from '@/app/lib/http';
import { ITrack, TrackAction, TrackActionTypes } from '@/app/types/tracks';
import { AlertAction } from '@/app/types/alert';
import { resolveAssetUrl } from '@/app/utils/resolveAssetUrl';
import { showAlert } from './alert';

export const fetchTracks = () => {
  return async (dispatch: Dispatch<TrackAction | AlertAction>) => {
    try {
      const response = await $api.get<ITrack[]>('/tracks');
      const tracks = response.data.map((track) => ({
        ...track,
        picture: resolveAssetUrl(track.picture),
        audio: resolveAssetUrl(track.audio),
      }));

      dispatch({ type: TrackActionTypes.FETCH_TRACKS, payload: tracks });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch({ type: TrackActionTypes.FETCH_TRACKS_ERROR, payload: message });
      dispatch(showAlert(message));
    }
  };
};

export const searchTracks = (query: string) => {
  return async (dispatch: Dispatch<TrackAction | AlertAction>) => {
    try {
      const response = await $api.get<ITrack[]>(`/tracks/search?query=${query}`);
      const tracks = response.data.map((track) => ({
        ...track,
        picture: resolveAssetUrl(track.picture),
        audio: resolveAssetUrl(track.audio),
      }));

      dispatch({ type: TrackActionTypes.FETCH_TRACKS, payload: tracks });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch({ type: TrackActionTypes.FETCH_TRACKS_ERROR, payload: message });
      dispatch(showAlert(message));
    }
  };
};
