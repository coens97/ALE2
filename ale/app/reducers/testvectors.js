export default function testvector(state = { files: [] }, action) {
  switch (action.type) {
    case 'TESTVECTORS_GETLIST_SUCCESS':
      return {
        ...state,
        files: action.files
      };
    default:
      return state;
  }
}
