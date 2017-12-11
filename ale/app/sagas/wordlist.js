import { takeEvery, put } from 'redux-saga/effects';
import { generateWordlistSuccess } from '../actions/wordlist';
import { takeEpselonTransition, takeTransition } from './statemachine/transition';

function* generateWords({ statemachine }) {
  /*
  const allStates = Object.keys(statemachine.states)
    .map(state => ({ ...statemachine.states[state], state }));
  let currentStates = allStates.filter(state => state.initial).map(x => x.state);
  */
  yield put(generateWordlistSuccess(['a', 'b']));
}

function* generateWordsSaga() {
  yield takeEvery('GENERATE_WORDLIST', generateWords);
}

export default generateWordsSaga;
