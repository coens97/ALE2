import { takeEvery, call, put } from 'redux-saga/effects';
import { startLoadTestVectorfileFailed, startLoadTestVectorfilePassed } from '../actions/testvectors';

const fs = require('fs');

const readFile = (filename) =>
  new Promise((resolve, reject) => {
    fs.readFile(`./testvectors/${filename}`, 'utf8', (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

function* loadFile({ filename }) {
  console.log(filename);
  try {
    // Wait for IO call
    const filecontent = yield call(() => readFile(filename));
    // Seperate line
    const lines = filecontent.split('\n');
    // Empty result object
    let parsedFile = {
      alphabet: [],
      states: [],
      final: [],
      transitions: [],
    };
    let readingTransitions = false;
    // Parse each line
    lines.some((line) => {
      if (line.startsWith('end.')) return true; // Stop parsing when reaching end

      if (!readingTransitions) {
        if (line.startsWith('transitions:')) {
          readingTransitions = true;
        } else if (line.startsWith('alphabet:')) {
          let alphabet = line
            .substring(9) // Remove the word
            .split('') // String to char array
            .filter(x => x !== ' '); // Remove spaces

          alphabet = Array.from(new Set(alphabet)); // Remove duplicates
          parsedFile = {
            ...parsedFile,
            alphabet };
        } else if (line.startsWith('states:')) {
          let states = line
            .substring(7) // Remove the word
            .trim() // Remove space before and after
            .split(','); // String to char array

          states = Array.from(new Set(states)); // Remove duplicates
          parsedFile = {
            ...parsedFile,
            states };
        } else if (line.startsWith('final:')) {
          let final = line
            .substring(6) // Remove the word
            .trim() // Remove space before and after
            .split(','); // String to char array

          final = Array.from(new Set(final)); // Remove duplicates
          parsedFile = {
            ...parsedFile,
            final };
        } // if doesn't match ignore
      } else { // Reading transitions
        // Read character from it's direct location,
        // Assuming it is written correct :D
        const from = line[0];
        const character = line[2];
        const to = line[8];
        // Create object and push to array in immutable way
        const transition = { from, character, to };
        const transitions = [...parsedFile.transitions, transition];
        parsedFile = {
          ...parsedFile,
          transitions };
      }
      return false; // Not finished
    });
    yield put(startLoadTestVectorfilePassed(parsedFile));
  } catch (error) {
    // When there is error make an event
    yield put(startLoadTestVectorfileFailed(error));
  }
}

function* testVectorParserSaga() {
  yield takeEvery('TESTVECTOR_LOADFILE', loadFile);
}

export default testVectorParserSaga;
