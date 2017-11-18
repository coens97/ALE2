// @flow
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import type { counterStateType } from '../reducers/counter';
import mySaga from '../sagas';

const sagaMiddleware = createSagaMiddleware();
const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(sagaMiddleware, router);

function configureStore(initialState?: counterStateType) {
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(mySaga);
  return store;
}

export default { configureStore, history };
