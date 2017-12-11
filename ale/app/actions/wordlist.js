export function generateWordlist(statemachine) {
  return {
    type: 'GENERATE_WORDLIST',
    statemachine,
  };
}

export function generateWordlistSuccess(words) {
  return {
    type: 'GENERATE_WORDLIST_SUCCESS',
    words,
  };
}
