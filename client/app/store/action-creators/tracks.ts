import { Dispatch } from 'redux';

import { resolveAssetUrl } from '@/app/utils/resolveAssetUrl';
import $api from '@/app/lib/http';
import { AlertAction } from '@/app/types/alert';
import { ITrack, TrackAction, TrackActionTypes } from '@/app/types/tracks';

import { showAlert } from './alert';

type PaginatedTracksResponse = { tracks: ITrack[]; totalCount: number };

const fetchAndDispatchTracks = (
  dispatch: Dispatch<TrackAction | AlertAction>,
  url: string,
  params: Record<string, string | number>,
) => {
  return $api
    .get<PaginatedTracksResponse>(url, { params })
    .then((response) => {
      const tracks = response.data.tracks.map((track) => ({
        ...track,
        picture: resolveAssetUrl(track.picture),
        audio: resolveAssetUrl(track.audio),
      }));

      dispatch({
        type: TrackActionTypes.FETCH_TRACKS,
        payload: { tracks, totalCount: response.data.totalCount },
      });
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch({ type: TrackActionTypes.FETCH_TRACKS_ERROR, payload: message });
      dispatch(showAlert(message));
    });
};

export const fetchTracks = (count: number = 10, offset: number = 0) => {
  return (dispatch: Dispatch<TrackAction | AlertAction>) =>
    fetchAndDispatchTracks(dispatch, '/tracks', { count, offset });
};

export const searchTracks = (
  query: string,
  count: number = 10,
  offset: number = 0,
) => {
  return (dispatch: Dispatch<TrackAction | AlertAction>) =>
    fetchAndDispatchTracks(dispatch, '/tracks/search', {
      query,
      count,
      offset,
    });
};

export const deleteTrack = (id: string) => {
  return async (dispatch: Dispatch<TrackAction | AlertAction>) => {
    try {
      await $api.delete(`/tracks/${id}`);
      dispatch({ type: TrackActionTypes.DELETE_TRACK, payload: id });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
    }
  };
};

export const updateTrack = (id: string, formData: FormData) => {
  return async (dispatch: Dispatch<TrackAction | AlertAction>) => {
    try {
      const response = await $api.put<ITrack>(`/tracks/${id}`, formData);
      const track = {
        ...response.data,
        picture: resolveAssetUrl(response.data.picture),
        audio: resolveAssetUrl(response.data.audio),
      };

      dispatch({ type: TrackActionTypes.UPDATE_TRACK, payload: track });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
    }
  };
};
