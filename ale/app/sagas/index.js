import { call, put, takeEvery } from 'redux-saga/effects';
import { testVectorsGetlist, testVectorsGetlistSuccess, testVectorsGetlistFailed } from '../actions/testvectors';

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
  yield call(startApp);
}

export default mySaga;
