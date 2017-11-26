// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import testvectors from './testvectors';
import statemachine from './statemachine';
import statemachinemeta from './statemachinemeta';
import dynamicresult from './dynamicresult';

const rootReducer = combineReducers({
  testvectors,
  statemachine,
  statemachinemeta,
  dynamicresult,
  router,
});

export default rootReducer;
