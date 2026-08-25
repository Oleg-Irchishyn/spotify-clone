import { PlayerActionTypes } from '@/app/types/player';
import { ITrack } from '@/app/types/tracks';

import {
  pauseTrack,
  playTrack,
  setActiveTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleLoop,
  toggleMute,
} from '../player';

describe('player action creators', () => {
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

  it('playTrack() returns a PLAY action', () => {
    expect(playTrack()).toEqual({ type: PlayerActionTypes.PLAY });
  });

  it('pauseTrack() returns a PAUSE action', () => {
    expect(pauseTrack()).toEqual({ type: PlayerActionTypes.PAUSE });
  });

  it('setDuration() returns a SET_DURATION action with the payload', () => {
    expect(setDuration(180)).toEqual({
      type: PlayerActionTypes.SET_DURATION,
      payload: 180,
    });
  });

  it('setVolume() returns a SET_VOLUME action with the payload', () => {
    expect(setVolume(50)).toEqual({
      type: PlayerActionTypes.SET_VOLUME,
      payload: 50,
    });
  });

  it('setCurrentTime() returns a SET_CURRENT_TIME action with the payload', () => {
    expect(setCurrentTime(42)).toEqual({
      type: PlayerActionTypes.SET_CURRENT_TIME,
      payload: 42,
    });
  });

  it('setActiveTrack() returns a SET_ACTIVE action with the track', () => {
    expect(setActiveTrack(track)).toEqual({
      type: PlayerActionTypes.SET_ACTIVE,
      payload: track,
    });
  });

  it('setActiveTrack(null) returns a SET_ACTIVE action clearing the track', () => {
    expect(setActiveTrack(null)).toEqual({
      type: PlayerActionTypes.SET_ACTIVE,
      payload: null,
    });
  });

  it('toggleLoop() returns a TOGGLE_LOOP action', () => {
    expect(toggleLoop()).toEqual({ type: PlayerActionTypes.TOGGLE_LOOP });
  });

  it('toggleMute() returns a TOGGLE_MUTE action', () => {
    expect(toggleMute()).toEqual({ type: PlayerActionTypes.TOGGLE_MUTE });
  });
});
