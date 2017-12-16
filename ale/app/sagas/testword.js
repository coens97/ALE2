import { takeEvery, select, put } from 'redux-saga/effects';
import { testWordResult } from '../actions/testword';
import { testWord } from './statemachine/word';

function* testSingleWord({ word }) {
  const statemachine = yield select(state => state.statemachine);
  const result = testWord(statemachine, word);
  yield put(testWordResult(result));
}

function* testwordSaga() {
  yield takeEvery('TESRWORD_TEST', testSingleWord);
}

export default testwordSaga;
