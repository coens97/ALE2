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

export function stateMachineGraph(graph) {
  return {
    type: 'STATEMACHINEGRAPH_LOADED',
    graph,
  };
}
