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

function parseRegex(statemachine, regex, start, end) {
  let current = statemachine; // statemachine worked on during this itteration
  // Match the operand
  switch (regex[0]) {
    case '*(': {
      const number = Object.keys(current.states).length;
      const startState = `br${number}`;
      const endState = `er${number}`;
      // add start state for repeat
      current = {
        ...current,
        states: {
          ...current.states,
          [startState]: {
            initial: false,
            final: false,
            transitions: [],
          }
        }
      };
      // add end state with a transition to the end, and to its begin state
      current = {
        ...current,
        states: {
          ...current.states,
          [endState]: {
            initial: false,
            final: false,
            transitions: [
              {
                character: '_',
                to: end,
              },
              {
                character: '_',
                to: startState,
              }
            ],
          }
        }
      };
      // add epselon from start to end, and add epselon to first state of the repeat
      current = {
        ...current,
        states: {
          ...current.states,
          [start]: {
            ...current.states[start],
            transitions: current.states[start].transitions.concat(
              [{
                character: '_',
                to: end,
              },
              {
                character: '_',
                to: startState,
              }
              ]
            )
          }
        }
      };
      current = parseRegex(current, regex[1], startState, endState); // Recursively parse leaves
      break;
    }
    case '|(': {
      break;
    }
    default: { // if it is a transition
      const letter = regex[0][0];
      current = {
        ...current,
        alphabet: [...new Set([...current.alphabet, letter])],
        states: {
          ...current.states,
          [start]: {
            ...current.states[start],
            transitions: current.states[start].transitions.concat([{
              character: letter,
              to: end,
            }]),
          }
        }
      };
    }
  }
  return current;
}

function* constructSateMachine({ regex }) {
  // Make empty statemachine with initial and final state
  const initialStatemachine = {
    alphabet: [],
    states: {
      i: {
        initial: true,
        final: false,
        transitions: [],
      },
      f: {
        initial: false,
        final: true,
        transitions: [],
      }
    }
  };
  const statemachine = parseRegex(initialStatemachine, regex, 'i', 'f');
  yield put(stateMachineLoaded(statemachine));
}

function* regexSaga() {
  yield takeEvery('REGEX_LOAD', loadRegex);
  yield takeEvery('REGEX_LOAD_PASSED', constructSateMachine);
}

export default regexSaga;
