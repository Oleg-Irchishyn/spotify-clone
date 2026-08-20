import { makeStore } from '../index';

describe('makeStore', () => {
  it('creates a store with the root reducer initial state', () => {
    const store = makeStore();
    const state = store.getState();

    expect(state.player).toBeDefined();
    expect(state.tracks).toBeDefined();
    expect(state.albums).toBeDefined();
    expect(state.alert).toBeDefined();
    expect(state.auth).toBeDefined();
  });

  it('supports dispatching plain actions', () => {
    const store = makeStore();

    store.dispatch({ type: 'PAUSE' });

    expect(store.getState().player.pause).toBe(true);
  });

  it('supports dispatching thunks via redux-thunk', async () => {
    const store = makeStore();
    const thunk = async (dispatch: (action: unknown) => void) => {
      dispatch({ type: 'HIDE_ALERT' });
    };

    await store.dispatch(thunk as never);

    expect(store.getState().alert.open).toBe(false);
  });
});
