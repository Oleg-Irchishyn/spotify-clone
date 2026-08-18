import { ITrack } from './tracks';

interface PlayerState {
  active: null | ITrack;
  volume: number;
  duration: number;
  currentTime: number;
  pause: boolean;
  loop: boolean;
}

enum PlayerActionTypes {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
  SET_ACTIVE = 'SET_ACTIVE',
  SET_DURATION = 'SET_DURATION',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_VOLUME = 'SET_VOLUME',
  TOGGLE_LOOP = 'TOGGLE_LOOP',
}

interface PlayAction {
  type: PlayerActionTypes.PLAY;
}

interface PauseAction {
  type: PlayerActionTypes.PAUSE;
}

interface SetActiveAction {
  type: PlayerActionTypes.SET_ACTIVE;
  payload: ITrack;
}

interface SetDurationAction {
  type: PlayerActionTypes.SET_DURATION;
  payload: number;
}

interface SetVolumeAction {
  type: PlayerActionTypes.SET_VOLUME;
  payload: number;
}

interface SetCurrentTimeAction {
  type: PlayerActionTypes.SET_CURRENT_TIME;
  payload: number;
}

interface ToggleLoopAction {
  type: PlayerActionTypes.TOGGLE_LOOP;
}

type PlayerAction =
  | PlayAction
  | PauseAction
  | SetActiveAction
  | SetDurationAction
  | SetVolumeAction
  | SetCurrentTimeAction
  | ToggleLoopAction;

export { type PlayerState, PlayerActionTypes, type PlayerAction };
