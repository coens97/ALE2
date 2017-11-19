import { takeEvery, put } from 'redux-saga/effects';
import { stateMachineGraph } from '../actions/statemachine';

function* createGraph({ statemachine }) {
  // begin with static first line
  let dotfile = ['digraph {', 'rankdir=LR;'];
  // add every state
  dotfile = dotfile.concat(
    Object.keys(statemachine.states)
      .map(x => `"${x}" [shape=${statemachine.states[x].final ? 'doublecircle' : 'circle'}]`)
  );
  // Add transitions
  Object.keys(statemachine.states).some(s => { // foreach state
    const state = statemachine.states[s];
    if (state.initial) {
      dotfile = [...dotfile, `"" -> "${s}"`];
    }
    dotfile = dotfile.concat(
      state.transitions
        .map(x => `"${s}" -> "${x.to}" [label="${x.character === '_' ? 'ε' : x.character}"]`)
    );
    return false; // keep looping
  });
  // Add last line
  dotfile = [...dotfile, '}'];
  yield put(stateMachineGraph(dotfile.join('')));
}

function* stateMachineGraphSaga() {
  yield takeEvery('STATEMACHINE_LOADED', createGraph);
}

export default stateMachineGraphSaga;
