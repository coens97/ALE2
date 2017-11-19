export default function statemachinemeta(state = { dfa: false }, action) {
  switch (action.type) {
    case 'STATEMACHINEMETA_LOADED':
      return Object.assign({}, state, action.meta);
    default:
      return state;
  }
}
