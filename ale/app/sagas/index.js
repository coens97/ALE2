import { call, put, takeEvery, fork } from 'redux-saga/effects';
import { testVectorsGetlist, testVectorsGetlistSuccess, testVectorsGetlistFailed } from '../actions/testvectors';
import testVectorParserSaga from './testvectorparser';
import stateMachineMetaSaga from './statemachinemeta';
import stateMachineGraphSaga from './statemachinegraph';

const fs = require('fs');

function* startApp() {
  // yield put(init());
  yield put(testVectorsGetlist());
}

// Get list of filenames from testvectors directory
function* getTestvectorsList() {
  try {
    // Wait for IO call
    const files = yield call(() => new Promise((resolve, reject) => {
      fs.readdir('./testvectors/', (error, result) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    }));
    // Dispatch event with file names
    yield put(testVectorsGetlistSuccess(files));
  } catch (error) {
    // When there is error make an event
    yield put(testVectorsGetlistFailed(error));
  }
}

function* mySaga() {
  yield takeEvery('TESTVECTORS_GETLIST', getTestvectorsList);
  yield fork(testVectorParserSaga);
  yield fork(stateMachineMetaSaga);
  yield fork(stateMachineGraphSaga);
  yield call(startApp);
}

export default mySaga;
