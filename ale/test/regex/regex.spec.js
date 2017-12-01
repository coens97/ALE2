import { expectSaga } from 'redux-saga-test-plan';
import { fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import statemachine from '../../app/reducers/statemachine';
import testword from '../../app/sagas/testword';
import regexSaga from '../../app/sagas/regex';
import { error } from 'util';

it('Can test regex', () => {
  // Combine needed sagas
  function* saga() {
    yield fork(testword);
    yield fork(regexSaga);
  }
  // Two categories of test vector files
  const tests =
    {
      '*(a)': [['', 'Passed'], ['aaaaaaaa', 'Passed'], ['aaaabaaaa', 'No transition']],
      '.(|(a,b),c)': [['ac', 'Passed'], ['bc', 'Passed'], ['ab', 'No transition']],
      '.(|(a,b),*(c))': [['a', 'Passed'], ['c', 'No transition'], ['bccccc', 'Passed']],
    };

  const makePromise = (text, word, result) =>
    expectSaga(saga)
      .withReducer(combineReducers({ statemachine }))
      .put.like({ action: { type: 'REGEX_LOAD_PASSED' } }) // Is tested inside other test
      .put.like({ action: { type: 'STATEMACHINE_LOADED' } })
      .put({
        type: 'TESTWORD_TEST_RESULT',
        result,
      })
      .dispatch({ // Call to regex
        type: 'REGEX_LOAD',
        text,
      })
      .delay(20) // annoying delay
      .dispatch({ // Call to test a word
        type: 'TESRWORD_TEST',
        word,
      })
      .run()
      .catch((err) => {
        const location = `${text} ${word} ${result} failed`;
        console.error(location);
        console.error(err);
        throw Error(location);
      });

  // Make a list of promises, run all tests in parallel
  const promises = Object.keys(tests).map((x) => tests[x].map((y) => makePromise(x, y[0], y[1])))
    .reduce((a, b) => a.concat(b)); // Select many
  return Promise.all(promises); // Let the test wait until all are finished
});
