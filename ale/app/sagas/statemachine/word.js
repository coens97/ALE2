import { Stack } from 'immutable';
import { takeEpselonTransition, takeTransition } from './transition';

export const testPdaWord = (statemachine, word) => {
  let currentState = Object.keys(statemachine.states)
    .map(state => ({ ...statemachine.states[state], state }))
    .find((x) => x.initial).state;
  let stack = Stack();
  let epselonSteps = 0;
  const maxEpselonSteps = 2000;

  const doTransition = (char, stackFrom) => {
    const transition = statemachine.states[currentState].transitions
      .find(x => x.character === char && x.stackFrom === stackFrom);
    if (typeof transition === 'undefined') { // found no transition
      return false;
    }
    if (stackFrom !== '_' && stack.size === 0) { // can't pop stack
      return false;
    }
    if (stackFrom !== '_') { // pop the stack
      stack = stack.pop();
    }
    if (transition.stackTo !== '_') { // push to stack
      stack = stack.push(transition.stackTo);
    }
    if (char === '_') {
      epselonSteps += 1;
    }
    currentState = transition.to;
    return true;
  };

  for (let i = 0, len = word.length; i < len; i += 1) {
    const char = word[i];
    const stackPeek = stack.peek();
    const isMovedState =
      doTransition(char, stackPeek) || // 1. transition whose [symbol + pop stack] matches the [current input symbol + current top stack] (if the stack is not empty)
      doTransition(char, '_'); // 2. transition with epsilon pop stack whose symbol matches the current input symbol
    if (!isMovedState) {
      const takeEpselon =
        doTransition('_', stackPeek) || // 3. transition with epsilon symbol whose pop stack matches the current top stack  (if the stack is not empty)
        doTransition('_', '_'); // 4. transition with epsilon symbol and epsilon pop stack
      if (takeEpselon) {
        i -= 1; // redo the same character
        if (epselonSteps >= maxEpselonSteps) { // Stop infinite loop
          return 'Epselon overflow';
        }
      } else {
        return 'No transition';
      }
    }
  }

  // Keep taking epselon transitions
  while (!(statemachine.states[currentState].final && stack.size === 0)
    && doTransition('_', '_')) {
    if (epselonSteps >= maxEpselonSteps) { // Stop infinite loop
      return 'Epselon overflow end';
    }
  }
  if (!statemachine.states[currentState].final) {
    return 'No final state';
  }
  if (stack.size > 0) {
    return 'Stack is not empty';
  }
  return 'Passed';
};

export const testNdfaWord = (statemachine, word) => {
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

const isPda = (statemachine) =>
  Object.keys(statemachine.states).some(state =>
    statemachine.states[state].transitions
    .some(transition => transition.stackFrom !== '_' || transition.stackTo !== '_'));

export const testWord = ((statemachine, word) =>
    isPda(statemachine) ? testPdaWord(statemachine, word) : testNdfaWord(statemachine, word));
