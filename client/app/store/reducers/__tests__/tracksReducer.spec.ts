import { ITrack, TrackActionTypes } from '@/app/types/tracks';

import { tracksReducer } from '../tracksReducer';

describe('tracksReducer', () => {
  const track: ITrack = {
    _id: 'id1',
    name: 'Track',
    artist: 'Artist',
    text: '',
    listens: 0,
    audio: 'audio.mp3',
    picture: 'picture.jpg',
    comments: [],
  };

  it('returns the initial state by default', () => {
    const state = tracksReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({
      tracks: [],
      totalCount: 0,
      loading: true,
      error: '',
    });
  });

  it('FETCH_TRACKS_START sets loading and clears the error', () => {
    const errored = {
      tracks: [],
      totalCount: 0,
      loading: false,
      error: 'Oops',
    };

    const state = tracksReducer(errored, {
      type: TrackActionTypes.FETCH_TRACKS_START,
    });

    expect(state).toEqual({
      tracks: [],
      totalCount: 0,
      loading: true,
      error: '',
    });
  });

  it('FETCH_TRACKS replaces tracks/totalCount and clears loading', () => {
    const state = tracksReducer(undefined, {
      type: TrackActionTypes.FETCH_TRACKS,
      payload: { tracks: [track], totalCount: 1 },
    });

    expect(state).toEqual({
      tracks: [track],
      totalCount: 1,
      loading: false,
      error: '',
    });
  });

  it('FETCH_TRACKS_ERROR stores the error and clears loading', () => {
    const state = tracksReducer(undefined, {
      type: TrackActionTypes.FETCH_TRACKS_ERROR,
      payload: 'Server error',
    });

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Server error');
  });

  it('DELETE_TRACK removes the track and decrements totalCount', () => {
    const populated = {
      tracks: [track],
      totalCount: 1,
      loading: false,
      error: '',
    };

    const state = tracksReducer(populated, {
      type: TrackActionTypes.DELETE_TRACK,
      payload: track._id,
    });

    expect(state.tracks).toEqual([]);
    expect(state.totalCount).toBe(0);
  });

  it('DELETE_TRACK does not let totalCount go below zero', () => {
    const populated = { tracks: [], totalCount: 0, loading: false, error: '' };

    const state = tracksReducer(populated, {
      type: TrackActionTypes.DELETE_TRACK,
      payload: 'missing-id',
    });

    expect(state.totalCount).toBe(0);
  });

  it('UPDATE_TRACK replaces the matching track in place', () => {
    const populated = {
      tracks: [track],
      totalCount: 1,
      loading: false,
      error: '',
    };
    const updated = { ...track, name: 'New name' };

    const state = tracksReducer(populated, {
      type: TrackActionTypes.UPDATE_TRACK,
      payload: updated,
    });

    expect(state.tracks).toEqual([updated]);
  });

  it('returns the same state for an unknown action', () => {
    const initial = tracksReducer(undefined, { type: '@@INIT' } as never);

    const state = tracksReducer(initial, { type: 'UNKNOWN' } as never);

    expect(state).toBe(initial);
  });
});
