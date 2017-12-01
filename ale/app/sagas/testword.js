import { takeEvery, select, put } from 'redux-saga/effects';
import { testWordResult } from '../actions/testword';

const takeTransition = (states, statemachine, char) => {
  const newStates = states
    .map(x => statemachine.states[x])
    .map(state =>
      // Get all epselon transition
      state.transitions.filter(transition => transition.character === char).map(x => x.to))
    .reduce((a, b) => a.concat(b), []); // from [[a,b],[c]] to [a,b,c] hence flatten array
  return unique(newStates);
};

const takeEpselonTransition = (states, statemachine) => {
  let currentStates = states;
  let oldNumber;
  do { // keep taking transitions until the number of states is not growing
    oldNumber = currentStates.length;
    currentStates = unique(currentStates
      .concat(takeTransition(currentStates, statemachine, '_')));
  }
  while (currentStates.length !== oldNumber);
  return currentStates;
};

const unique = (list) =>  // Remove duplicates
   [...new Set(list)];

function* testWord({ word }) {
  const statemachine = yield select(state => state.statemachine);

  // Test whetever statemachine is loaded
  if (!(('alphabet' in statemachine) && ('states' in statemachine))) {
    yield put(testWordResult('No statemachine'));
    return;
  }

  const allStates = Object.keys(statemachine.states)
    .map(state => ({ ...statemachine.states[state], state }));
  let currentStates = allStates.filter(state => state.initial).map(x => x.state);

  for (let i = 0, len = word.length; i < len; i += 1) {
    // Take all epsilon states
    currentStates = takeEpselonTransition(currentStates, statemachine);
    // Take the step for the character
    currentStates = takeTransition(currentStates, statemachine, word[i]);
    if (currentStates.length === 0) {
      yield put(testWordResult('No transition'));
      return;
    }
  }

  currentStates = takeEpselonTransition(currentStates, statemachine);

  // Check if any final state
  if (!currentStates.map(x => statemachine.states[x]).some(x => x.final)) {
    yield put(testWordResult('No final state'));
    return;
  }

  yield put(testWordResult('Passed'));
}

function* testwordSaga() {
  yield takeEvery('TESRWORD_TEST', testWord);
}

export default testwordSaga;
