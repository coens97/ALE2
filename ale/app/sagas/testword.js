import { takeEvery, call, put } from 'redux-saga/effects';
import { testWordResult } from '../actions/testword';

function* testWord({ word }) {
  
  yield put(testWordResult('Passed'));
}

function* testwordSaga() {
  yield takeEvery('TESRWORD_TEST', testWord);
}

export default testwordSaga;
