import actionCreators from '../index';

describe('action-creators index', () => {
  it('aggregates action creators from every domain module', () => {
    expect(typeof actionCreators.fetchAlbums).toBe('function');
    expect(typeof actionCreators.showAlert).toBe('function');
    expect(typeof actionCreators.hideAlert).toBe('function');
    expect(typeof actionCreators.login).toBe('function');
    expect(typeof actionCreators.playTrack).toBe('function');
    expect(typeof actionCreators.fetchTracks).toBe('function');
  });
});
