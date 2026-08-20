jest.mock('@/app/lib/http', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

import $api from '@/app/lib/http';
import { AlertActionTypes } from '@/app/types/alert';
import { ITrack, TrackActionTypes } from '@/app/types/tracks';

import {
  deleteTrack,
  fetchTracks,
  listenTrack,
  searchTracks,
  updateTrack,
} from '../tracks';

const mockedApi = $api as jest.Mocked<typeof $api>;

const track: ITrack = {
  _id: 'id1',
  name: 'Track',
  artist: 'Artist',
  text: '',
  listens: 0,
  audio: 'audio.mp3',
  picture: 'image/1.jpg',
  comments: [],
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchTracks', () => {
  it('dispatches START then FETCH_TRACKS with resolved asset URLs on success', async () => {
    mockedApi.get.mockResolvedValue({
      data: { tracks: [track], totalCount: 1 },
    });
    const dispatch = jest.fn();

    await fetchTracks(5, 10, 'album1')(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: TrackActionTypes.FETCH_TRACKS_START,
    });
    expect(mockedApi.get).toHaveBeenCalledWith('/tracks', {
      params: { count: 5, offset: 10, albumId: 'album1' },
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: TrackActionTypes.FETCH_TRACKS,
      payload: {
        tracks: [expect.objectContaining({ _id: 'id1' })],
        totalCount: 1,
      },
    });
  });

  it('omits albumId from the params when not provided', async () => {
    mockedApi.get.mockResolvedValue({ data: { tracks: [], totalCount: 0 } });
    const dispatch = jest.fn();

    await fetchTracks()(dispatch);

    expect(mockedApi.get).toHaveBeenCalledWith('/tracks', {
      params: { count: 10, offset: 0 },
    });
  });

  it('dispatches FETCH_TRACKS_ERROR and an alert on failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network fail'));
    const dispatch = jest.fn();

    await fetchTracks()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: TrackActionTypes.FETCH_TRACKS_ERROR,
      payload: 'Network fail',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Network fail', severity: 'error' },
    });
  });
});

describe('searchTracks', () => {
  it('calls the search endpoint with the query and album filter', async () => {
    mockedApi.get.mockResolvedValue({ data: { tracks: [], totalCount: 0 } });
    const dispatch = jest.fn();

    await searchTracks('bohemian', 5, 10, 'album1')(dispatch);

    expect(mockedApi.get).toHaveBeenCalledWith('/tracks/search', {
      params: { query: 'bohemian', count: 5, offset: 10, albumId: 'album1' },
    });
  });
});

describe('deleteTrack', () => {
  it('deletes the track and dispatches DELETE_TRACK on success', async () => {
    mockedApi.delete.mockResolvedValue({});
    const dispatch = jest.fn();

    await deleteTrack('id1')(dispatch);

    expect(mockedApi.delete).toHaveBeenCalledWith('/tracks/id1');
    expect(dispatch).toHaveBeenCalledWith({
      type: TrackActionTypes.DELETE_TRACK,
      payload: 'id1',
    });
  });

  it('dispatches an alert on failure', async () => {
    mockedApi.delete.mockRejectedValue(new Error('Cannot delete'));
    const dispatch = jest.fn();

    await deleteTrack('id1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Cannot delete', severity: 'error' },
    });
  });
});

describe('listenTrack', () => {
  it('posts the listen event', async () => {
    mockedApi.post.mockResolvedValue({});

    await listenTrack('id1')();

    expect(mockedApi.post).toHaveBeenCalledWith('/tracks/listen/id1');
  });

  it('silently ignores failures', async () => {
    mockedApi.post.mockRejectedValue(new Error('fail'));

    await expect(listenTrack('id1')()).resolves.toBeUndefined();
  });
});

describe('updateTrack', () => {
  it('updates the track and dispatches UPDATE_TRACK with resolved asset urls', async () => {
    mockedApi.put.mockResolvedValue({ data: track });
    const dispatch = jest.fn();
    const formData = new FormData();

    await updateTrack('id1', formData)(dispatch);

    expect(mockedApi.put).toHaveBeenCalledWith('/tracks/id1', formData);
    expect(dispatch).toHaveBeenCalledWith({
      type: TrackActionTypes.UPDATE_TRACK,
      payload: expect.objectContaining({ _id: 'id1' }),
    });
  });

  it('dispatches an alert on failure', async () => {
    mockedApi.put.mockRejectedValue(new Error('Cannot update'));
    const dispatch = jest.fn();

    await updateTrack('id1', new FormData())(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Cannot update', severity: 'error' },
    });
  });
});
