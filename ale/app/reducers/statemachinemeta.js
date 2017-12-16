export default function statemachinemeta(state = {
  infinite: false,
  dfa: false,
  dot: '',
  words: [''],
  expectedDfa: false,
  expectedInfinite: false,
  expectedWords: [['', true]],
}, action) {
  switch (action.type) {
    case 'REGEX_LOAD_PASSED':
      return { // Regex has no expected values
        ...state,
        expectedDfa: false,
        expectedInfinite: false,
        expectedWords: [''],
      };
    case 'TESTVECTOR_LOADFILE_PASSED': {
      const { expectedDfa, expectedInfinite, expectedWords } = action.test;
      return {
        ...state,
        expectedDfa,
        expectedInfinite,
        expectedWords,
      };
    }
    case 'STATEMACHINE_LOADED':
      return {
        ...state,
        words: [],
      };
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
