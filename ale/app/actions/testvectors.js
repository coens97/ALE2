export function testVectorsGetlist() {
  return {
    type: 'TESTVECTORS_GETLIST'
  };
}

export function testVectorsGetlistSuccess(files) {
  return {
    type: 'TESTVECTORS_GETLIST_SUCCESS',
    files,
  };
}

export function testVectorsGetlistFailed(error) {
  return {
    type: 'TESTVECTORS_GETLIST_FAILED',
    error,
  };
}
