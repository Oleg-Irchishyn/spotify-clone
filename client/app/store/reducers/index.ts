import { combineReducers } from 'redux';

import { alertReducer } from './alertReducer';
import { playerReducer } from './playerReducer';
import { tracksReducer } from './tracksReducer';

const rootReducer = combineReducers({
  player: playerReducer,
  tracks: tracksReducer,
  alert: alertReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export { rootReducer, type RootState };
