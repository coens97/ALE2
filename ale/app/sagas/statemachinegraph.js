import { takeEvery, put } from 'redux-saga/effects';
import { stateMachineGraph } from '../actions/statemachine';

function* createGraph({ statemachine }) {
  let dotfile = ['digraph {', 'rankdir=LR;'];
  dotfile = dotfile.concat(
    Object.keys(statemachine.states)
      .map(x => `"${x}" [shape=${statemachine.states[x].final ? 'doublecircle' : 'circle'}]`)
  );
  dotfile = [...dotfile, '}'];
  yield put(stateMachineGraph(dotfile.join()));
}

function* stateMachineGraphSaga() {
  yield takeEvery('STATEMACHINE_LOADED', createGraph);
}

export default stateMachineGraphSaga;
