import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import { testVectorsGetlist } from '../actions/testvectors';

class TestvectorList extends Component {
  props: {
    testVectorsGetlist: () => void,
    files: string[]
  };

  render() {
    return (
      <div>
        <button onClick={this.props.testVectorsGetlist}>
          <i className="fa fa-refresh" />
        </button>
        <Dropdown options={this.props.files} onChange={() => {}} value={0} placeholder="Select a testfile" />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  files: state.testvectors.files,
});

const mapDispatchToProps = dispatch => ({
  testVectorsGetlist: () => {
    dispatch(testVectorsGetlist());
  },
});

export default connect(mapStateToProps,
  mapDispatchToProps)(TestvectorList);
