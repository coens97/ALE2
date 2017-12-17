const unique = (list) =>  // Remove duplicates
  [...new Set(list)];

export const takeTransition = (states, statemachine, char) => {
  const newStates = states
    .map(x => statemachine.states[x])
    .map(state =>
      // Get all epselon transition
      state.transitions.filter(transition => transition.character === char).map(x => x.to))
    .reduce((a, b) => a.concat(b), []); // from [[a,b],[c]] to [a,b,c] hence flatten array
  return unique(newStates);
};

export const takeEpselonTransition = (states, statemachine) => {
  let currentStates = states;
  let oldNumber;
  do { // keep taking transitions until the number of states is not growing
    oldNumber = currentStates.length;
    currentStates = unique(currentStates
      .concat(takeTransition(currentStates, statemachine, '_')));
  }
  while (currentStates.length !== oldNumber);
  return currentStates;
};
