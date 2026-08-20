import { PlayerActionTypes } from '@/app/types/player';
import { ITrack } from '@/app/types/tracks';

import { playerReducer } from '../playerReducer';

describe('playerReducer', () => {
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
    const state = playerReducer(undefined, { type: '@@INIT' } as never);

    expect(state).toEqual({
      currentTime: 0,
      duration: 0,
      active: null,
      volume: 100,
      pause: false,
      loop: false,
    });
  });

  it('PAUSE sets pause to true', () => {
    const state = playerReducer(undefined, { type: PlayerActionTypes.PAUSE });

    expect(state.pause).toBe(true);
  });

  it('PLAY sets pause to false', () => {
    const paused = {
      ...playerReducer(undefined, { type: '@@INIT' } as never),
      pause: true,
    };

    const state = playerReducer(paused, { type: PlayerActionTypes.PLAY });

    expect(state.pause).toBe(false);
  });

  it('SET_CURRENT_TIME updates currentTime', () => {
    const state = playerReducer(undefined, {
      type: PlayerActionTypes.SET_CURRENT_TIME,
      payload: 42,
    });

    expect(state.currentTime).toBe(42);
  });

  it('SET_VOLUME updates volume', () => {
    const state = playerReducer(undefined, {
      type: PlayerActionTypes.SET_VOLUME,
      payload: 50,
    });

    expect(state.volume).toBe(50);
  });

  it('SET_DURATION updates duration', () => {
    const state = playerReducer(undefined, {
      type: PlayerActionTypes.SET_DURATION,
      payload: 180,
    });

    expect(state.duration).toBe(180);
  });

  it('SET_ACTIVE sets the active track and resets time/duration', () => {
    const dirtyState = {
      ...playerReducer(undefined, { type: '@@INIT' } as never),
      currentTime: 30,
      duration: 180,
    };

    const state = playerReducer(dirtyState, {
      type: PlayerActionTypes.SET_ACTIVE,
      payload: track,
    });

    expect(state.active).toEqual(track);
    expect(state.currentTime).toBe(0);
    expect(state.duration).toBe(0);
  });

  it('TOGGLE_LOOP flips the loop flag', () => {
    const initial = playerReducer(undefined, { type: '@@INIT' } as never);

    const toggledOn = playerReducer(initial, {
      type: PlayerActionTypes.TOGGLE_LOOP,
    });
    expect(toggledOn.loop).toBe(true);

    const toggledOff = playerReducer(toggledOn, {
      type: PlayerActionTypes.TOGGLE_LOOP,
    });
    expect(toggledOff.loop).toBe(false);
  });
});
