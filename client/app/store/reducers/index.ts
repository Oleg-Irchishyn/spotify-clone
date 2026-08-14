import { combineReducers } from 'redux';
import { playerReducer } from './playerReducer';
import { tracksReducer } from './tracksReducer';
import { alertReducer } from './alertReducer';

const rootReducer = combineReducers({
  player: playerReducer,
  tracks: tracksReducer,
  alert: alertReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export { rootReducer, type RootState };
