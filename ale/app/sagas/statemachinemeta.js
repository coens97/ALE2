import { takeEvery, call, put } from 'redux-saga/effects';
import { stateMachineMeta } from '../actions/statemachine';

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

const checkInfinite = ({ alphabet, states }) => new Promise(resolve => {
  const result =  false;
  resolve(result);
});

function* createMeta({ statemachine }) {
  // Start all needed promises
  const dfaPromise = checkDfa(statemachine);
  const infinitePromise = checkInfinite(statemachine);
  // wait for promisses and the result
  const dfa = yield call(() => dfaPromise);
  const infinite = yield call(() => infinitePromise);
  yield put(stateMachineMeta({ dfa, infinite }));
}

function* stateMachineMetaSaga() {
  yield takeEvery('STATEMACHINE_LOADED', createMeta);
}

export default stateMachineMetaSaga;
