export default function dynamicresult(state = { testword: ' ', regexerror: '' }, action) {
  switch (action.type) {
    case 'STATEMACHINEMETA_LOADED':
      return { ...state, testword: ' ', regexerror: '' };
    case 'TESTWORD_TEST_RESULT':
      return { ...state, testword: action.result };
    case 'REGEX_LOAD_FAILED':
      return { ...state, regexerror: action.error };
    case 'REGEX_LOAD_PASSED':
      return { ...state, regexerror: '' };
    default:
      return state;
  }
}
