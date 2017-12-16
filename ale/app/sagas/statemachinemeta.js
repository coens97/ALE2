import { takeEvery, call, put, select } from 'redux-saga/effects';
import { Set } from 'immutable';
import { stateMachineMeta, stateMachineMetaWords } from '../actions/statemachine';
import { generateWordlist } from '../actions/wordlist';
import { takeEpselonTransition, takeTransition } from './statemachine/transition';
import { testWord } from './statemachine/word';

const checkDfa = ({ alphabet, states }) => new Promise(resolve => {
  const result = !Object.values(states).some(x => {
    if (x.transitions.some(y => y.character === '_')) {
      return true; // If statemachine containe _ it is NDFA
    }
    const transitionChars = x.transitions.map(y => y.character);
    if (alphabet.every(y => transitionChars.includes(y))) {
      return false;
    }
    return true;
  });
  resolve(result);
});

const checkInfinite = (statemachine) => new Promise(resolve => {
  const { states, alphabet } = statemachine;
  // Change from object to array
  const allStates = Object.keys(states)
    .map(state => ({ ...states[state], state }));
  let startStates = allStates.filter(state => state.initial).map(x => x.state);
  startStates = takeEpselonTransition(startStates, statemachine);
  const startVisitedStates = Set().add(startStates);

  const toFinal = (currentStates, visitedStates) => {
    if (currentStates.map(x => statemachine.states[x]).some(x => x.final)) { // if at final state
      console.log('It is infinite!');
      return true;
    }

    for (let i = 0, tot = alphabet.length; i < tot; i += 1) {
      const char = alphabet[i];
      // Take char transition
      let movedStates = takeTransition(currentStates, statemachine, char);
      // take epsilon transitions
      movedStates = takeEpselonTransition(movedStates, statemachine);
      // if didn't pass that state yet, and it is not a sink
      if (!visitedStates.has(JSON.stringify(movedStates)) && movedStates.length !== 0) {
        // recursively go deeper
        if (toFinal(movedStates, visitedStates.add(JSON.stringify(movedStates)))) {
          return true;
        }
      }
    }
    return false;
  };

  const traverse = (currentStates, visitedStates) => {
    for (let i = 0, tot = alphabet.length; i < tot; i += 1) {
      const char = alphabet[i];
      // Take char transition
      let movedStates = takeTransition(currentStates, statemachine, char);
      // take epsilon transitions
      movedStates = takeEpselonTransition(movedStates, statemachine);

      if (visitedStates.has(JSON.stringify(movedStates))) {
        // found a loop, check if it can go to a final state
        console.log('Found loop!');
        if (toFinal(movedStates, Set().add(JSON.stringify(movedStates)))) {
          return true;
        }
      } else if (movedStates.length !== 0) { // if not at the "sink"
        if (traverse(movedStates, visitedStates.add(JSON.stringify(movedStates)))) {
          return true;
        }
      }
    }
    return false;
  };
  const result = traverse(startStates, startVisitedStates);

  resolve(result);
});

function* createMeta({ statemachine }) {
  // Start all needed promises
  const dfaPromise = checkDfa(statemachine);
  const infinitePromise = checkInfinite(statemachine);
  // wait for promisses and the result
  const dfa = yield call(() => dfaPromise);
  const infinite = yield call(() => infinitePromise);
  if (!infinite) { // if list is not infinite, generate list of words
    yield put(generateWordlist(statemachine));
  }
  yield put(stateMachineMeta({ dfa, infinite }));

  // Test words in testvector
  const expectedWords = yield select(state => state.statemachinemeta.expectedWords);
  const resultWords = expectedWords.map((word) =>
    [...word, testWord(statemachine, word[0]) === 'Passed']);
  yield put(stateMachineMetaWords(resultWords));
}

function* stateMachineMetaSaga() {
  yield takeEvery('STATEMACHINE_LOADED', createMeta);
}

export default stateMachineMetaSaga;
