import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { thunk } from 'redux-thunk';
import { rootReducer } from './reducers';

const makeStore = () => createStore(rootReducer, undefined, applyMiddleware(thunk));

type AppStore = ReturnType<typeof makeStore>;
type AppDispatch = AppStore['dispatch'];

export { makeStore, type AppStore, type AppDispatch };
export type { RootState } from './reducers';
