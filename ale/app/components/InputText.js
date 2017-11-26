import React, { Component } from 'react';
import { connect } from 'react-redux';
import { testVectorsGetlist, startLoadTestVectorfile } from '../actions/testvectors';

class InputText extends Component {
  props: {
    testWord: (x: string) => void
  };

  constructor(props) {
    super(props);
    this.state = {
      word: ''
    };
  }

  render() {
    return (
      <div>
        <ul>
          <li>
            <Dropdown options={this.props.files} onChange={selected => this.setState({ selected: selected.value })} value={this.state.selected} placeholder="Select a testfile" />
          </li>
          <li style={{ width: '50px', padding: '10px' }}>
            <button onClick={this.props.testVectorsGetlist}>
              <i className="fa fa-refresh" />
            </button>
          </li>
          <li style={{ padding: '10px' }}>
            <button onClick={() => this.props.startLoadVector(this.state.selected)}>
              <i className="fa fa-play" />
            </button>
          </li>
        </ul>
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
