// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import testvectors from './testvectors';

const rootReducer = combineReducers({
  testvectors,
  router,
});

export default rootReducer;
