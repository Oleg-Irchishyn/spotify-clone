import { Dispatch } from 'redux';

import { extractErrorMessage } from '@/app/utils/extractErrorMessage';
import { resolveAssetUrl } from '@/app/utils/resolveAssetUrl';
import $api from '@/app/lib/http';
import { AlertAction } from '@/app/types/alert';
import { PlayerAction } from '@/app/types/player';
import { ITrack, TrackAction, TrackActionTypes } from '@/app/types/tracks';
import type { RootState } from '@/app/store';

import { showAlert } from './alert';
import { setActiveTrack } from './player';

type PaginatedTracksResponse = { tracks: ITrack[]; totalCount: number };

const fetchAndDispatchTracks = (
  dispatch: Dispatch<TrackAction | AlertAction>,
  url: string,
  params: Record<string, string | number>,
) => {
  dispatch({ type: TrackActionTypes.FETCH_TRACKS_START });

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
      const message = extractErrorMessage(error);
      dispatch({ type: TrackActionTypes.FETCH_TRACKS_ERROR, payload: message });
      dispatch(showAlert(message));
    });
};

export const fetchTracks = (
  count: number = 10,
  offset: number = 0,
  albumId?: string,
) => {
  return (dispatch: Dispatch<TrackAction | AlertAction>) =>
    fetchAndDispatchTracks(dispatch, '/tracks', {
      count,
      offset,
      ...(albumId ? { albumId } : {}),
    });
};

export const searchTracks = (
  query: string,
  count: number = 10,
  offset: number = 0,
  albumId?: string,
) => {
  return (dispatch: Dispatch<TrackAction | AlertAction>) =>
    fetchAndDispatchTracks(dispatch, '/tracks/search', {
      query,
      count,
      offset,
      ...(albumId ? { albumId } : {}),
    });
};

export const deleteTrack = (id: string) => {
  return async (
    dispatch: Dispatch<TrackAction | AlertAction | PlayerAction>,
    getState: () => RootState,
  ) => {
    try {
      await $api.delete(`/tracks/${id}`);
      dispatch({ type: TrackActionTypes.DELETE_TRACK, payload: id });
      if (getState().player.active?._id === id) {
        dispatch(setActiveTrack(null));
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      dispatch(showAlert(message));
    }
  };
};

export const listenTrack = (id: string) => {
  return async () => {
    try {
      await $api.post(`/tracks/listen/${id}`);
    } catch {
      // Listen tracking is non-critical - ignore failures silently.
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
      const message = extractErrorMessage(error);
      dispatch(showAlert(message));
    }
  };
};
