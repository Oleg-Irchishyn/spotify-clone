import { combineReducers } from 'redux';
import { playerReducer } from './playerReducer';

const rootReducer = combineReducers({
  player: playerReducer,
});

type RootState = ReturnType<typeof rootReducer>;

export { rootReducer, type RootState };
