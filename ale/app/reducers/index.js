// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import testvectors from './testvectors';
import statemachinemeta from './statemachinemeta';

const rootReducer = combineReducers({
  testvectors,
  statemachinemeta,
  router,
});

export default rootReducer;
