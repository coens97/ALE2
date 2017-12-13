export default function statemachinemeta(state = { infinite: false, dfa: false, dot: '', words: [''] }, action) {
  switch (action.type) {
    case 'STATEMACHINE_LOADED':
      return { ...state, words: [] };
    case 'STATEMACHINEMETA_LOADED':
      return Object.assign({}, state, action.meta);
    case 'STATEMACHINEGRAPH_LOADED':
      return { ...state, dot: action.graph };
    case 'GENERATE_WORDLIST_SUCCESS':
      return { ...state, words: action.words };
    default:
      return state;
  }
}
