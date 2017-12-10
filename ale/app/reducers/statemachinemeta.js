export default function statemachinemeta(state = { infinite: false, dfa: false, dot: '' }, action) {
  switch (action.type) {
    case 'STATEMACHINEMETA_LOADED':
      return Object.assign({}, state, action.meta);
    case 'STATEMACHINEGRAPH_LOADED':
      return { ...state, dot: action.graph };
    default:
      return state;
  }
}
