import { expectSaga } from 'redux-saga-test-plan';
import { fork } from 'redux-saga/effects';
import stateMachineMetaSaga from '../../app/sagas/statemachinemeta';
import testVectorParserSaga from '../../app/sagas/testvectorparser';

it('Can test dfa', () => {
  // Combine needed sagas
  function* saga() {
    yield fork(stateMachineMetaSaga);
    yield fork(testVectorParserSaga);
  }
  // Two categories of test vector files
  const nonDfa = ['abstar', 'epselon'];
  const dfas = ['dfa'];

  const makePromise = (filename, dfa) =>
    expectSaga(saga)
      .put.like({ action: { type: 'TESTVECTOR_LOADFILE_PASSED' } }) // Is tested inside other test
      .put.like({ action: { type: 'STATEMACHINE_LOADED' } }) // Skip
      .put({
        type: 'STATEMACHINEMETA_LOADED',
        meta: { dfa }
      })
      .dispatch({ // Call to load file
        type: 'TESTVECTOR_LOADFILE',
        filename,
      })
      .run();

  // Make a list of promises, run all tests in parallel
  const promises = nonDfa.map(x => makePromise(x, false))
                    .concat(dfas.map(x => makePromise(x, true)));
  return Promise.all(promises); // Let the test wait until all are finished
});
