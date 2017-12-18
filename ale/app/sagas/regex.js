import { takeEvery, put } from 'redux-saga/effects';
import { Parser, Grammar } from 'nearley';
import { stateMachineLoaded } from '../actions/statemachine';
import { loadRegexPassed, loadRegexError } from '../actions/regex';
// import grammar from './regex.ne'; // nearley-loader doesnt work with jest :(
import grammar from './regexne';

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

// Start of constructing statemachine
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
  const state = parseRegex(initialStatemachine, regex, 'i', 'f');
  yield put(stateMachineLoaded(state));
}

// Helper functions to mutate the statemachine
const addState = (state, statename) => ({
  ...state,
  states: {
    ...state.states,
    [statename]: {
      initial: false,
      final: false,
      transitions: [],
    }
  }
});

const addStateTransitions = (state, statename, transitions) => ({
  ...state,
  states: {
    ...state.states,
    [statename]: {
      ...state.states[statename],
      transitions: state.states[statename].transitions.concat(transitions)
    }
  }
});

// Recursive method to parse the regex
const parseRegex = (state, regex, start, end) => {
  let current = state; // statemachine worked on during this itteration
  // Match the operand
  switch (regex[0]) {
    case '*(': {
      const number = Object.keys(current.states).length;
      const startState = `br${number}`;
      const endState = `er${number}`;
      // add start state for repeat
      current = addState(current, startState);
      // add end state with a transition to the end, and to its begin state
      current = addState(current, endState);
      current = addStateTransitions(current, endState,
        [
          {
            character: '_',
            to: end,
            stackFrom: '_',
            stackTo: '_',
          },
          {
            character: '_',
            to: startState,
            stackFrom: '_',
            stackTo: '_',
          }
        ]);
      // add epselon from start to end, and add epselon to first state of the repeat
      current = addStateTransitions(current, start,
        [{
          character: '_',
          to: end,
          stackFrom: '_',
          stackTo: '_',
        },
        {
          character: '_',
          to: startState,
          stackFrom: '_',
          stackTo: '_',
        }
        ]);
      current = parseRegex(current, regex[1], startState, endState); // Recursively parse leaves
      break;
    }
    case '|(': {
      const number = Object.keys(current.states).length;
      const startUpState = `bu${number}`;
      const endUpState = `eu${number}`;
      const startDownState = `bd${number}`;
      const endDownState = `ed${number}`;
      // Create start states
      current = addState(current, startUpState);
      current = addState(current, startDownState);
      // make epselon transitions to the start states
      current = addStateTransitions(current, start,
        [{
          character: '_',
          to: startUpState,
          stackFrom: '_',
          stackTo: '_',
        },
        {
          character: '_',
          to: startDownState,
          stackFrom: '_',
          stackTo: '_',
        }
        ]);
      // add end states
      current = addState(current, endUpState);
      current = addState(current, endDownState);
      // add transitions from the end states to the end
      current = addStateTransitions(current, endUpState,
        [{
          character: '_',
          to: end,
          stackFrom: '_',
          stackTo: '_',
        }]);
      current = addStateTransitions(current, endDownState,
        [{
          character: '_',
          to: end,
          stackFrom: '_',
          stackTo: '_',
        }]);
      // run the 2 leaves
      current = parseRegex(current, regex[1], startUpState, endUpState);
      current = parseRegex(current, regex[3], startDownState, endDownState);
      break;
    }
    case '.(': {
      // Create a state in the middle
      const number = Object.keys(current.states).length;
      const middleState = `m${number}`;
      current = addState(current, middleState);
      // Parse both sides
      current = parseRegex(current, regex[1], start, middleState);
      current = parseRegex(current, regex[3], middleState, end);
      break;
    }
    default: { // if it is a transition
      const letter = regex[0][0];
      current = {
        ...current,
        alphabet: letter === '_' ? current.alphabet : [...new Set([...current.alphabet, letter])],
        states: {
          ...current.states,
          [start]: {
            ...current.states[start],
            transitions: current.states[start].transitions.concat([{
              character: letter,
              to: end,
              stackFrom: '_',
              stackTo: '_',
            }]),
          }
        }
      };
    }
  }
  return current;
};

function* regexSaga() {
  yield takeEvery('REGEX_LOAD', loadRegex);
  yield takeEvery('REGEX_LOAD_PASSED', constructSateMachine);
}

export default regexSaga;
