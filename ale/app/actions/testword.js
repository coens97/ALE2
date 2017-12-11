export function testWord(word) {
  return {
    type: 'TESRWORD_TEST',
    word,
  };
}

export function testWordResult(result) {
  return {
    type: 'TESTWORD_TEST_RESULT',
    result,
  };
}
