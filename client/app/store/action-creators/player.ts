import { PlayerAction, PlayerActionTypes } from '@/app/types/player';
import { ITrack } from '@/app/types/tracks';

const playTrack = (): PlayerAction => ({ type: PlayerActionTypes.PLAY });

const pauseTrack = (): PlayerAction => ({ type: PlayerActionTypes.PAUSE });

const setDuration = (payload: number): PlayerAction => ({
  type: PlayerActionTypes.SET_DURATION,
  payload,
});

const setVolume = (payload: number): PlayerAction => ({
  type: PlayerActionTypes.SET_VOLUME,
  payload,
});

const setCurrentTime = (payload: number): PlayerAction => ({
  type: PlayerActionTypes.SET_CURRENT_TIME,
  payload,
});

const setActiveTrack = (payload: ITrack): PlayerAction => ({
  type: PlayerActionTypes.SET_ACTIVE,
  payload,
});

const toggleLoop = (): PlayerAction => ({
  type: PlayerActionTypes.TOGGLE_LOOP,
});

export {
  playTrack,
  pauseTrack,
  setDuration,
  setVolume,
  setCurrentTime,
  setActiveTrack,
  toggleLoop,
};
