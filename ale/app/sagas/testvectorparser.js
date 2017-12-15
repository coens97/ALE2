import { takeEvery, call, put } from 'redux-saga/effects';
import { startLoadTestVectorfileFailed, startLoadTestVectorfilePassed } from '../actions/testvectors';
import { stateMachineLoaded } from '../actions/statemachine';

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
      expectedDfa: false,
      expectedInfinite: false,
      expectedWords: [],
    };

    let readPart = 0;
    // Parse each line
    lines.some((line) => {
      switch (readPart) {
        case 0: { // parse states, final and alphabet
          if (line.startsWith('transitions:')) {
            readPart = 1;
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
          break;
        }
        case 1: { // parse transitions
          if (line.startsWith('end.')) {
            readPart = 2;
          } else {
            // Reading transitions
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
          break;
        }
        case 2: { // parse transitions
          if (line.startsWith('dfa:')) {
            parsedFile = { ...parsedFile, expectedDfa: line[4] === 'y' };
          } else if (line.startsWith('finite:')) {
            parsedFile = { ...parsedFile, expectedInfinite: line[7] !== 'y' };
          } else if (line.startsWith('words:')) {
            readPart = 3;
          }
          break;
        }
        case 3: { // parse words
          const word = line.split(',');
          if (word.length === 2) {
            parsedFile = {
              ...parsedFile,
              expectedWords: [...parsedFile.expectedWords, [word[0], word[1] === 'y']],
            };
          }
          break;
        }
        default:
      }
      return false; // Not finished
    });
    yield put(startLoadTestVectorfilePassed(parsedFile));
  } catch (error) {
    // When there is error make an event
    console.error(error);
    yield put(startLoadTestVectorfileFailed(error));
  }
}

function* fileToStatemachine({ test }) {
  // Transform the data from the file to structure used within application
  const states = test.states
    .reduce((result, item, index) => ({
      ...result,
      [item]: {
        initial: index === 0,
        final: test.final.includes(item),
        transitions: test.transitions
          .filter(x => x.from === item)
          .map(x => ({ character: x.character, to: x.to }))
      }
    }), {});
  const statemachine = {
    alphabet: test.alphabet,
    states,
  };
  yield put(stateMachineLoaded(statemachine));
}

function* testVectorParserSaga() {
  yield takeEvery('TESTVECTOR_LOADFILE', loadFile);
  yield takeEvery('TESTVECTOR_LOADFILE_PASSED', fileToStatemachine);
}

export default testVectorParserSaga;
