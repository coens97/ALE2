export default function statemachine(state = {}, action) {
  switch (action.type) {
    case 'STATEMACHINE_LOADED':
      return Object.assign({}, state, action.statemachine);
    default:
      return state;
  }
}
