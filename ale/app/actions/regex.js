export function loadRegex(text) {
  return {
    type: 'REGEX_LOAD',
    text,
  };
}

export function loadRegexError(error) {
  return {
    type: 'REGEX_LOAD_FAILED',
    error,
  };
}

export function loadRegexPassed(regex) {
  return {
    type: 'REGEX_LOAD_PASSED',
    regex,
  };
}
