// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import counter from './counter';
import testvectors from './testvectors';

const rootReducer = combineReducers({
  counter,
  testvectors,
  router,
});

export default rootReducer;
