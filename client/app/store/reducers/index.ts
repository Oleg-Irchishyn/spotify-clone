import { combineReducers } from 'redux';

import { albumsReducer } from './albumsReducer';
import { alertReducer } from './alertReducer';
import { playerReducer } from './playerReducer';
import { tracksReducer } from './tracksReducer';

const rootReducer = combineReducers({
  player: playerReducer,
  tracks: tracksReducer,
  albums: albumsReducer,
  alert: alertReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export { rootReducer, type RootState };
