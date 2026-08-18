import { Dispatch } from 'redux';

import { resolveAssetUrl } from '@/app/utils/resolveAssetUrl';
import $api from '@/app/lib/http';
import type { RootState } from '@/app/store';
import { AlertAction } from '@/app/types/alert';
import { AlbumAction, AlbumActionTypes, IAlbum } from '@/app/types/albums';

import { showAlert } from './alert';

type PaginatedAlbumsResponse = { albums: IAlbum[]; totalCount: number };

const resolveAlbumAssetUrl = (album: IAlbum): IAlbum => ({
  ...album,
  picture: resolveAssetUrl(album.picture),
});

export const fetchAlbums = (
  query: string = '',
  count: number = 10,
  offset: number = 0,
) => {
  return (dispatch: Dispatch<AlbumAction | AlertAction>) => {
    dispatch({ type: AlbumActionTypes.FETCH_ALBUMS_START });

    return $api
      .get<PaginatedAlbumsResponse>('/album', {
        params: { query, count, offset },
      })
      .then((response) => {
        const albums = response.data.albums.map(resolveAlbumAssetUrl);
        dispatch({
          type: AlbumActionTypes.FETCH_ALBUMS,
          payload: { albums, totalCount: response.data.totalCount },
        });
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Server error';
        dispatch({ type: AlbumActionTypes.FETCH_ALBUMS_ERROR, payload: message });
        dispatch(showAlert(message));
      });
  };
};

export const setActiveAlbum = (album: IAlbum | null): AlbumAction => ({
  type: AlbumActionTypes.SET_ACTIVE_ALBUM,
  payload: album,
});

export const resolveActiveAlbum = () => {
  return async (
    dispatch: Dispatch<AlbumAction>,
    getState: () => RootState,
  ) => {
    if (getState().albums.activeAlbumResolved) {
      return;
    }

    try {
      const { data } = await $api.get<PaginatedAlbumsResponse>('/album', {
        params: { query: '', count: 1, offset: 0 },
      });
      const [firstAlbum] = data.albums;
      dispatch(
        setActiveAlbum(firstAlbum ? resolveAlbumAssetUrl(firstAlbum) : null),
      );
    } catch {
      dispatch(setActiveAlbum(null));
    }
  };
};

export const deleteAlbum = (id: string) => {
  return async (dispatch: Dispatch<AlbumAction | AlertAction>) => {
    try {
      await $api.delete(`/album/${id}`);
      dispatch({ type: AlbumActionTypes.DELETE_ALBUM, payload: id });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
    }
  };
};

export const updateAlbum = (id: string, formData: FormData) => {
  return async (dispatch: Dispatch<AlbumAction | AlertAction>) => {
    try {
      const response = await $api.put<IAlbum>(`/album/${id}`, formData);
      dispatch({
        type: AlbumActionTypes.UPDATE_ALBUM,
        payload: resolveAlbumAssetUrl(response.data),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Server error';
      dispatch(showAlert(message));
    }
  };
};
