import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropdown from 'react-dropdown';
import { testVectorsGetlist, startLoadTestVectorfile } from '../actions/testvectors';

class TestvectorList extends Component {
  props: {
    testVectorsGetlist: () => void,
    startLoadVector: (x: string) => void,
    files: string[]
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: ''
    };
  }

  render() {
    return (
      <div>
        <button onClick={this.props.testVectorsGetlist}>
          <i className="fa fa-refresh" />
        </button>
        <Dropdown options={this.props.files} onChange={selected => this.setState({ selected: selected.value })} value={this.state.selected} placeholder="Select a testfile" />
        <button onClick={() => this.props.startLoadVector(this.state.selected)}>
          <i className="fa fa-play" />
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
  startLoadVector: (filename) => {
    dispatch(startLoadTestVectorfile(filename));
  },
});

export default connect(mapStateToProps,
  mapDispatchToProps)(TestvectorList);
