import { takeEvery, put } from 'redux-saga/effects';
import { Parser, Grammar } from 'nearley';
import { stateMachineLoaded } from '../actions/statemachine';
import { loadRegexPassed, loadRegexError } from '../actions/regex';
import grammar from './regex.ne';

function* loadRegex({ text }) {
  // Create parser from the regex.ne file
  const parser = new Parser(Grammar.fromCompiled(grammar));
  try {
    const ans = parser.feed(text);
    if (ans.results.length && ans.results[0].length) {
      yield put(loadRegexPassed(ans.results[0][0]));
    } else {
      yield put(loadRegexError('Empty regex'));
    }
  } catch (err) {
    yield put(loadRegexError(`Error at character ${err.offset}`));
  }
}

function* constructSateMachine({ regex }) {
  const statemachine = {};

  //yield put(stateMachineLoaded(statemachine));
}

function* regexSaga() {
  yield takeEvery('REGEX_LOAD', loadRegex);
  yield takeEvery('REGEX_LOAD_PASSED', constructSateMachine);
}

export default regexSaga;
