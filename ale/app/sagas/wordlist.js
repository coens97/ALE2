import { takeEvery, put } from 'redux-saga/effects';
import { Set } from 'immutable';
import { generateWordlistSuccess } from '../actions/wordlist';
import { takeEpselonTransition, takeTransition } from './statemachine/transition';

function* generateWords({ statemachine }) {
  const { states, alphabet } = statemachine;
  const allStates = Object.keys(states)
    .map(state => ({ ...states[state], state }));
  let startStates = allStates.filter(state => state.initial).map(x => x.state);
  startStates = takeEpselonTransition(startStates, statemachine);
  const generateWord = (currentStates, visitedStates, words, word) => {
    let newWords = words;
    if (currentStates.map(x => statemachine.states[x]).some(x => x.final)) { // if at final state
      newWords = words.add(word);
    }

    for (let i = 0, tot = alphabet.length; i < tot; i += 1) {
      const char = alphabet[i];
      const newWord = word + char;
      // Take char transition
      let movedStates = takeTransition(currentStates, statemachine, char);
      // take epsilon transitions
      movedStates = takeEpselonTransition(movedStates, statemachine);
      // if didn't pass that state yet, and it is not a sink
      if (!visitedStates.has(JSON.stringify(movedStates)) && movedStates.length !== 0) {
        // recursively go deeper
        newWords = generateWord(movedStates, visitedStates.add(JSON.stringify(movedStates)), newWords, newWord);
      }
    }
    return newWords;
  };
  const words = generateWord(startStates, Set(), Set(), '');
  yield put(generateWordlistSuccess(words));
}

function* generateWordsSaga() {
  yield takeEvery('GENERATE_WORDLIST', generateWords);
}

export default generateWordsSaga;
