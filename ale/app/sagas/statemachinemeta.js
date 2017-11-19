import { takeEvery, call, put } from 'redux-saga/effects';
import { stateMachineMeta } from '../actions/statemachine';

function checkDfa({ alphabet, states }) {
  return new Promise(resolve => {
    const result = !Object.values(states).some(x => {
      if (x.transitions.some(y => y.character === '_')) {
        return true; // If statemachine containe _ it is NDFA
      }
      const transitionChars = x.transitions.map(y => y.character);
      if (alphabet.every(y => transitionChars.includes(y))){
        return false;
      }
      return true;
    });
    resolve(result);
  });
}

function* createMeta({ statemachine }) {
  const dfa = yield call(() => checkDfa(statemachine));
  yield put(stateMachineMeta({ dfa }));
}

function* stateMachineMetaSaga() {
  yield takeEvery('STATEMACHINE_LOADED', createMeta);
}

export default stateMachineMetaSaga;
