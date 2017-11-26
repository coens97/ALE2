export default function dynamicresult(state = { testword: ' ' }, action) {
  switch (action.type) {
    case 'STATEMACHINEMETA_LOADED':
      return {...state, testword: ' '};
    case 'TESTWORD_TEST_RESULT':
      return {...state, testword: action.result};
    default:
      return state;
  }
}
