import { takeEvery, select, call } from 'redux-saga/effects';

const dialog = require('electron').remote.dialog;
const fs = require('fs');

function* createFile() {
  const statemachine = yield select(state => state.statemachine);
  const statemachinemeta = yield select(state => state.statemachinemeta);
  if ('alphabet' in statemachine) {
    let file = [];
    // build testvector file
    file = [...file, `alphabet: ${statemachine.alphabet.join('')}`];
    file = [...file, `states: ${Object.keys(statemachine.states).join(',')}`];
    // states to array
    const allStates = Object.keys(statemachine.states)
      .map(state => ({ ...statemachine.states[state], state }));
    file = [...file, `final: ${allStates.filter(x => x.final).map(x => x.state).join(',')}`];
    file = [...file, 'transitions:'];
    for (let i = 0, tot = allStates.length; i < tot; i += 1) {
      const s = allStates[i];
      file = [...file, ...s.transitions.map(x => `${s.state},${x.character} [${x.stackFrom},${x.stackTo}] --> ${x.to}`)];
    }
    file = [...file, 'end.'];

    file = [...file, `dfa:${statemachinemeta.dfa ? 'y' : 'n'}`];
    file = [...file, `finite:${statemachinemeta.infinite ? 'n' : 'y'}`];

    file = [...file, 'words:'];
    for (let i = 0, tot = statemachinemeta.expectedWords.length; i < tot; i += 1) {
      const w = statemachinemeta.expectedWords[i];
      file = [...file, ...w.map(`${w[0]},${w[1] ? 'y' : 'n'}`)];
    }
    file = [...file, 'end.'];
    // save file
    const fileText = file.join('\n');
    const filePath = yield call(() =>
      new Promise(resolve => dialog.showSaveDialog({ title: 'Save automota' }, resolve))
    );
    console.log(filePath);
    if (filePath != null) {
      fs.writeFile(filePath, fileText);
    }
  }
}

function* stateMachineSaveSaga() {
  yield takeEvery('STATEMACHINE_SAVE', createFile);
}

export default stateMachineSaveSaga;
