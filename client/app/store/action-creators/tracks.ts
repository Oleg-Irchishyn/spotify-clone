import { Dispatch } from 'redux';

import { resolveAssetUrl } from '@/app/utils/resolveAssetUrl';
import $api from '@/app/lib/http';
import { AlertAction } from '@/app/types/alert';
import { ITrack, TrackAction, TrackActionTypes } from '@/app/types/tracks';

import { showAlert } from './alert';

export const fetchTracks = (count: number = 10, offset: number = 0) => {
  return async (dispatch: Dispatch<TrackAction | AlertAction>) => {
    try {
      const response = await $api.get<{
        tracks: ITrack[];
        totalCount: number;
      }>('/tracks', {
        params: { count, offset },
      });
      const tracks = response.data.tracks.map((track) => ({
        ...track,
        picture: resolveAssetUrl(track.picture),
        audio: resolveAssetUrl(track.audio),
      }));

      dispatch({
        type: TrackActionTypes.FETCH_TRACKS,
        payload: { tracks, totalCount: response.data.totalCount },
      });
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
      const response = await $api.get<ITrack[]>(
        `/tracks/search?query=${query}`,
      );
      const tracks = response.data.map((track) => ({
        ...track,
        picture: resolveAssetUrl(track.picture),
        audio: resolveAssetUrl(track.audio),
      }));

      dispatch({
        type: TrackActionTypes.FETCH_TRACKS,
        payload: { tracks, totalCount: tracks.length },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch({ type: TrackActionTypes.FETCH_TRACKS_ERROR, payload: message });
      dispatch(showAlert(message));
    }
  };
};
