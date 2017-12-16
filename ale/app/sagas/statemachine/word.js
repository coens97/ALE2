import { takeEpselonTransition, takeTransition } from './transition';

export const testWord = (statemachine, word) => {
  const allStates = Object.keys(statemachine.states)
    .map(state => ({ ...statemachine.states[state], state }));
  let currentStates = allStates.filter(state => state.initial).map(x => x.state);

  for (let i = 0, len = word.length; i < len; i += 1) {
    // Take all epsilon states
    currentStates = takeEpselonTransition(currentStates, statemachine);
    // Take the step for the character
    currentStates = takeTransition(currentStates, statemachine, word[i]);
    if (currentStates.length === 0) {
      return 'No transition';
    }
  }

  currentStates = takeEpselonTransition(currentStates, statemachine);

  // Check if any final state
  if (!currentStates.map(x => statemachine.states[x]).some(x => x.final)) {
    return 'No final state';
  }
  return 'Passed';
};
