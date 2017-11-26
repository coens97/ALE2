import { takeEvery, select, put } from 'redux-saga/effects';
import { testWordResult } from '../actions/testword';

function* testWord({ word }) {
  const statemachine = yield select(state => state.statemachine);

  // Test whetever statemachine is loaded
  if (!(('alphabet' in statemachine) && ('states' in statemachine))) { 
    yield put(testWordResult('No statemachine'));
    return;
  }

  let currentStates;
  yield put(testWordResult('Passed'));
}

function* testwordSaga() {
  yield takeEvery('TESRWORD_TEST', testWord);
}

export default testwordSaga;
