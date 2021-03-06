export function stateMachineLoaded(statemachine) {
  return {
    type: 'STATEMACHINE_LOADED',
    statemachine,
  };
}

export function stateMachineMeta(meta) {
  return {
    type: 'STATEMACHINEMETA_LOADED',
    meta,
  };
}

export function stateMachineMetaWords(words) {
  return {
    type: 'STATEMACHINEMETA_WORDS',
    words,
  };
}

export function stateMachineGraph(graph) {
  return {
    type: 'STATEMACHINEGRAPH_LOADED',
    graph,
  };
}

export function stateMachineToDfa() {
  return {
    type: 'STATEMACHINEGRAPH_TODFA',
  };
}

export function stateMachineSave() {
  return {
    type: 'STATEMACHINE_SAVE',
  };
}
