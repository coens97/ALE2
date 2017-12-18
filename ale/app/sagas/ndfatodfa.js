import { takeEvery, put, select } from 'redux-saga/effects';
import { List } from 'immutable';
import { stateMachineLoaded } from '../actions/statemachine';
import { takeEpselonTransition, takeTransition } from './statemachine/transition';

const addStateTransition = (state, statename, transition) => ({
  ...state,
  states: {
    ...state.states,
    [statename]: {
      ...state.states[statename],
      transitions: [...state.states[statename].transitions, transition]
    }
  }
});

function* toDfa() {
  const statemachine = yield select(state => state.statemachine);
  if (!statemachine || !('alphabet' in statemachine)) { // if no statemachine
    return;
  }

  const { states, alphabet } = statemachine;
  // Move to initial states
  const allStates = Object.keys(states)
    .map(state => ({ ...states[state], state }));
  let startStates = allStates.filter(state => state.initial).map(x => x.state);
  startStates = takeEpselonTransition(startStates, statemachine);

  // Make mapping between states and new value
  let usedStates = { [JSON.stringify(startStates)]: 'i' };
  // initial new statemachine
  let newStateMachine = {
    alphabet: statemachine.alphabet,
    states: {
      i: {
        initial: true,
        final: startStates.some(state => statemachine.states[state].final),
        transitions: [],
      }
    }
  };

  // Create queue to keep track of
  let queue = List().push(JSON.stringify(startStates)); // use JSON so hashcode will work

  while (queue.size > 0) {
    const statesString = queue.get(0);
    queue = queue.delete(0);
    const currentStates = JSON.parse(statesString); // Parse JSON back

    for (let i = 0, tot = alphabet.length; i < tot; i += 1) {
      const char = alphabet[i];
      // move char positions

      let movedStates = takeTransition(currentStates, statemachine, char);
      // take epsilon transitions
      movedStates = takeEpselonTransition(movedStates, statemachine);
      const movedStatesString = JSON.stringify(movedStates);
      // check if statemachine already has state, or else create it
      if (!(movedStatesString in usedStates)) {
        const newState = Object.keys(usedStates).length;
        usedStates = { ...usedStates, [movedStatesString]: newState };
        // Check if any of the states are final
        const final = movedStates.some(state => statemachine.states[state].final);
        newStateMachine = {
          ...newStateMachine,
          states: {
            ...newStateMachine.states,
            [newState]: {
              initial: false,
              final,
              transitions: [],
            }
          }
        };
        // add state to queue
        if (!queue.has(movedStatesString)) {
          queue = queue.push(movedStatesString);
        }
      }
      // Add transition
      newStateMachine = addStateTransition(
        newStateMachine,
        usedStates[statesString],
        {
          character: char,
          to: usedStates[movedStatesString],
          stackFrom: '_',
          stackTo: '_',
        },
      );
    }
  }
  console.log(usedStates);
  yield put(stateMachineLoaded(newStateMachine));
}

function* ndfaToDfaSaga() {
  yield takeEvery('STATEMACHINEGRAPH_TODFA', toDfa);
}

export default ndfaToDfaSaga;
