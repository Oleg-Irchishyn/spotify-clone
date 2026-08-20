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
import { AlbumActionTypes, IAlbum } from '@/app/types/albums';
import { AlertActionTypes } from '@/app/types/alert';

import {
  deleteAlbum,
  fetchAlbums,
  resolveActiveAlbum,
  setActiveAlbum,
  updateAlbum,
} from '../albums';

const mockedApi = $api as jest.Mocked<typeof $api>;

const album: IAlbum = {
  _id: 'id1',
  name: 'A',
  author: 'B',
  picture: 'image/1.jpg',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fetchAlbums', () => {
  it('dispatches START then FETCH_ALBUMS with resolved asset URLs on success', async () => {
    mockedApi.get.mockResolvedValue({
      data: { albums: [album], totalCount: 1 },
    });
    const dispatch = jest.fn();

    await fetchAlbums('query', 5, 10)(dispatch);

    expect(dispatch).toHaveBeenNthCalledWith(1, {
      type: AlbumActionTypes.FETCH_ALBUMS_START,
    });
    expect(mockedApi.get).toHaveBeenCalledWith('/album', {
      params: { query: 'query', count: 5, offset: 10 },
    });
    expect(dispatch).toHaveBeenNthCalledWith(2, {
      type: AlbumActionTypes.FETCH_ALBUMS,
      payload: {
        albums: [expect.objectContaining({ _id: 'id1' })],
        totalCount: 1,
      },
    });
  });

  it('uses the default query/count/offset when omitted', async () => {
    mockedApi.get.mockResolvedValue({ data: { albums: [], totalCount: 0 } });
    const dispatch = jest.fn();

    await fetchAlbums()(dispatch);

    expect(mockedApi.get).toHaveBeenCalledWith('/album', {
      params: { query: '', count: 10, offset: 0 },
    });
  });

  it('dispatches FETCH_ALBUMS_ERROR and an alert on failure', async () => {
    mockedApi.get.mockRejectedValue(new Error('Network fail'));
    const dispatch = jest.fn();

    await fetchAlbums()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.FETCH_ALBUMS_ERROR,
      payload: 'Network fail',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Network fail', severity: 'error' },
    });
  });

  it('falls back to a generic message for non-Error rejections', async () => {
    mockedApi.get.mockRejectedValue('nope');
    const dispatch = jest.fn();

    await fetchAlbums()(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.FETCH_ALBUMS_ERROR,
      payload: 'Server error',
    });
  });
});

describe('setActiveAlbum', () => {
  it('returns a SET_ACTIVE_ALBUM action', () => {
    expect(setActiveAlbum(album)).toEqual({
      type: AlbumActionTypes.SET_ACTIVE_ALBUM,
      payload: album,
    });
  });
});

describe('resolveActiveAlbum', () => {
  it('does nothing when the active album is already resolved', async () => {
    const dispatch = jest.fn();
    const getState = jest
      .fn()
      .mockReturnValue({ albums: { activeAlbumResolved: true } });

    await resolveActiveAlbum()(dispatch, getState);

    expect(mockedApi.get).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('sets the first album with a resolved asset url when found', async () => {
    mockedApi.get.mockResolvedValue({
      data: { albums: [album], totalCount: 1 },
    });
    const dispatch = jest.fn();
    const getState = jest
      .fn()
      .mockReturnValue({ albums: { activeAlbumResolved: false } });

    await resolveActiveAlbum()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.SET_ACTIVE_ALBUM,
      payload: expect.objectContaining({ _id: 'id1' }),
    });
  });

  it('sets null when no albums exist', async () => {
    mockedApi.get.mockResolvedValue({ data: { albums: [], totalCount: 0 } });
    const dispatch = jest.fn();
    const getState = jest
      .fn()
      .mockReturnValue({ albums: { activeAlbumResolved: false } });

    await resolveActiveAlbum()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.SET_ACTIVE_ALBUM,
      payload: null,
    });
  });

  it('sets null when the request fails', async () => {
    mockedApi.get.mockRejectedValue(new Error('fail'));
    const dispatch = jest.fn();
    const getState = jest
      .fn()
      .mockReturnValue({ albums: { activeAlbumResolved: false } });

    await resolveActiveAlbum()(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.SET_ACTIVE_ALBUM,
      payload: null,
    });
  });
});

describe('deleteAlbum', () => {
  it('deletes the album and dispatches DELETE_ALBUM on success', async () => {
    mockedApi.delete.mockResolvedValue({});
    const dispatch = jest.fn();

    await deleteAlbum('id1')(dispatch);

    expect(mockedApi.delete).toHaveBeenCalledWith('/album/id1');
    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.DELETE_ALBUM,
      payload: 'id1',
    });
  });

  it('dispatches an alert on failure', async () => {
    mockedApi.delete.mockRejectedValue(new Error('Cannot delete'));
    const dispatch = jest.fn();

    await deleteAlbum('id1')(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Cannot delete', severity: 'error' },
    });
  });
});

describe('updateAlbum', () => {
  it('updates the album and dispatches UPDATE_ALBUM with a resolved asset url', async () => {
    mockedApi.put.mockResolvedValue({ data: album });
    const dispatch = jest.fn();
    const formData = new FormData();

    await updateAlbum('id1', formData)(dispatch);

    expect(mockedApi.put).toHaveBeenCalledWith('/album/id1', formData);
    expect(dispatch).toHaveBeenCalledWith({
      type: AlbumActionTypes.UPDATE_ALBUM,
      payload: expect.objectContaining({ _id: 'id1' }),
    });
  });

  it('dispatches an alert on failure', async () => {
    mockedApi.put.mockRejectedValue(new Error('Cannot update'));
    const dispatch = jest.fn();

    await updateAlbum('id1', new FormData())(dispatch);

    expect(dispatch).toHaveBeenCalledWith({
      type: AlertActionTypes.SHOW_ALERT,
      payload: { message: 'Cannot update', severity: 'error' },
    });
  });
});
