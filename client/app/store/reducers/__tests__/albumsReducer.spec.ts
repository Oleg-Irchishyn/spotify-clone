import { IAlbum, AlbumActionTypes } from '@/app/types/albums';

import { albumsReducer } from '../albumsReducer';

describe('albumsReducer', () => {
  const album: IAlbum = {
    _id: 'id1',
    name: 'Album',
    author: 'Author',
    picture: 'picture.jpg',
  };

  it('returns the initial state by default', () => {
    const state = albumsReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({
      albums: [],
      totalCount: 0,
      activeAlbum: null,
      activeAlbumResolved: false,
      loading: true,
      error: '',
    });
  });

  it('FETCH_ALBUMS_START sets loading and clears the error', () => {
    const errored = {
      ...albumsReducer(undefined, { type: '@@INIT' } as never),
      loading: false,
      error: 'Oops',
    };

    const state = albumsReducer(errored, {
      type: AlbumActionTypes.FETCH_ALBUMS_START,
    });

    expect(state.loading).toBe(true);
    expect(state.error).toBe('');
  });

  it('FETCH_ALBUMS stores albums/totalCount and clears loading', () => {
    const state = albumsReducer(undefined, {
      type: AlbumActionTypes.FETCH_ALBUMS,
      payload: { albums: [album], totalCount: 1 },
    });

    expect(state.albums).toEqual([album]);
    expect(state.totalCount).toBe(1);
    expect(state.loading).toBe(false);
  });

  it('FETCH_ALBUMS_ERROR stores the error and clears loading', () => {
    const state = albumsReducer(undefined, {
      type: AlbumActionTypes.FETCH_ALBUMS_ERROR,
      payload: 'Server error',
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server error');
  });

  it('DELETE_ALBUM removes the album and decrements totalCount', () => {
    const populated = {
      ...albumsReducer(undefined, { type: '@@INIT' } as never),
      albums: [album],
      totalCount: 1,
    };

    const state = albumsReducer(populated, {
      type: AlbumActionTypes.DELETE_ALBUM,
      payload: album._id,
    });

    expect(state.albums).toEqual([]);
    expect(state.totalCount).toBe(0);
  });

  it('DELETE_ALBUM does not let totalCount go below zero', () => {
    const populated = albumsReducer(undefined, { type: '@@INIT' } as never);

    const state = albumsReducer(populated, {
      type: AlbumActionTypes.DELETE_ALBUM,
      payload: 'missing-id',
    });

    expect(state.totalCount).toBe(0);
  });

  it('UPDATE_ALBUM replaces the matching album in place', () => {
    const populated = {
      ...albumsReducer(undefined, { type: '@@INIT' } as never),
      albums: [album],
    };
    const updated = { ...album, name: 'New name' };

    const state = albumsReducer(populated, {
      type: AlbumActionTypes.UPDATE_ALBUM,
      payload: updated,
    });

    expect(state.albums).toEqual([updated]);
  });

  it('SET_ACTIVE_ALBUM stores the active album and marks it resolved', () => {
    const state = albumsReducer(undefined, {
      type: AlbumActionTypes.SET_ACTIVE_ALBUM,
      payload: album,
    });

    expect(state.activeAlbum).toEqual(album);
    expect(state.activeAlbumResolved).toBe(true);
  });

  it('SET_ACTIVE_ALBUM accepts null to clear the active album', () => {
    const state = albumsReducer(undefined, {
      type: AlbumActionTypes.SET_ACTIVE_ALBUM,
      payload: null,
    });

    expect(state.activeAlbum).toBeNull();
    expect(state.activeAlbumResolved).toBe(true);
  });

  it('returns the same state for an unknown action', () => {
    const initial = albumsReducer(undefined, { type: '@@INIT' } as never);

    const state = albumsReducer(initial, { type: 'UNKNOWN' } as never);

    expect(state).toBe(initial);
  });
});
