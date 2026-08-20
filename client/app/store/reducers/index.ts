import { combineReducers } from 'redux';

import { albumsReducer } from './albumsReducer';
import { alertReducer } from './alertReducer';
import { authReducer } from './authReducer';
import { playerReducer } from './playerReducer';
import { tracksReducer } from './tracksReducer';

const rootReducer = combineReducers({
  player: playerReducer,
  tracks: tracksReducer,
  albums: albumsReducer,
  alert: alertReducer,
  auth: authReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export { rootReducer, type RootState };
