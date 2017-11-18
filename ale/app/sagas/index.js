import { call } from 'redux-saga/effects';

function* startApp() {
  // yield put(init());
  console.log("Saga started");
}

function* mySaga() {
  yield call(startApp);
}

export default mySaga;
