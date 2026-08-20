import { rootReducer } from '../index';

describe('rootReducer', () => {
  it('combines every domain reducer under its own key', () => {
    const state = rootReducer(undefined, { type: '@@INIT' } as never);

    expect(Object.keys(state).sort()).toEqual(
      ['albums', 'alert', 'auth', 'player', 'tracks'].sort(),
    );
  });
});
