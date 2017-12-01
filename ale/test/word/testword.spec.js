import { expectSaga } from 'redux-saga-test-plan';
import { fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import statemachine from '../../app/reducers/statemachine';
import testword from '../../app/sagas/testword';
import testVectorParserSaga from '../../app/sagas/testvectorparser';

it('Can test words', () => {
  // Combine needed sagas
  function* saga() {
    yield fork(testword);
    yield fork(testVectorParserSaga);
  }
  // Two categories of test vector files
  const tests =
    {
      ndfa: [['AAAABCACACAC', 'Passed'], ['AAAABCACACACA', 'No final state']],
      epselon: [['aab', 'No transition'], ['abbbb', 'Passed'], ['abbbbB', 'No transition']],
      manyepselon: [['a', 'Passed']],
    };

  const makePromise = (filename, word, result) =>
    expectSaga(saga)
      .withReducer(combineReducers({ statemachine }))
      .put.like({ action: { type: 'TESTVECTOR_LOADFILE_PASSED' } }) // Is tested inside other test
      .put.like({ action: { type: 'STATEMACHINE_LOADED' } })
      .put({
        type: 'TESTWORD_TEST_RESULT',
        result,
      })
      .dispatch({ // Call to load file
        type: 'TESTVECTOR_LOADFILE',
        filename,
      })
      .delay(20) // annoying delay
      .dispatch({ // Call to test a word
        type: 'TESRWORD_TEST',
        word,
      })
      .run();

  // Make a list of promises, run all tests in parallel
  const promises = Object.keys(tests).map((x) => tests[x].map((y) => makePromise(x, y[0], y[1])))
    .reduce((a, b) => a.concat(b)); // Select many
  return Promise.all(promises); // Let the test wait until all are finished
});
