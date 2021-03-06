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


export function startLoadTestVectorfile(filename) {
  return {
    type: 'TESTVECTOR_LOADFILE',
    filename,
  };
}

export function startLoadTestVectorfilePassed(test) {
  return {
    type: 'TESTVECTOR_LOADFILE_PASSED',
    test,
  };
}

export function startLoadTestVectorfileFailed(error) {
  return {
    type: 'TESTVECTOR_LOADFILE_FAILED',
    error,
  };
}
