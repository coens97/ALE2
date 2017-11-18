import React, { Component } from 'react';
import { connect } from 'react-redux';
import { testVectorsGetlist } from '../actions/testvectors';

class TestvectorList extends Component {
  props: {
    testVectorsGetlist: () => void
  };

  render() {
    return (
      <div>
        <button onClick={this.props.testVectorsGetlist} data-tclass="btn">
          <i className="fa fa-refresh" />
        </button>
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