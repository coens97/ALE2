import React, { Component } from 'react';
import { connect } from 'react-redux';
import { testVectorsGetlist, startLoadTestVectorfile } from '../actions/testvectors';
import { stateMachineToDfa, stateMachineSave } from '../actions/statemachine';

class TestvectorList extends Component {
  props: {
    testVectorsGetlist: () => void,
    startLoadVector: (x: string) => void,
    stateMachineToDfa: () => void,
    stateMachineSave: () => void,
    files: string[]
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: ''
    };
  }

  render() {
    const createItem = (item) =>
      (<option
        key={item}
        value={item}
      >
        {item}
      </option>);
    return (
      <div>
        <ul>
          <li style={{ width: '50px', padding: '10px' }}>
            <button className="btn btn-default" onClick={this.props.testVectorsGetlist}>
              <i className="fa fa-refresh" />
            </button>
          </li>
          <li style={{ padding: '12px' }}>
            <select className="form-control" onChange={selected => this.setState({ selected: selected.target.value })}>
              <option>Select a file</option>
              {this.props.files.map(createItem)}
            </select>
          </li>
          <li style={{ padding: '10px' }}>
            <button className="btn btn-primary" onClick={() => this.props.startLoadVector(this.state.selected)}>
              <i className="fa fa-play" />
            </button>
          </li>
          <li style={{ padding: '10px' }}>
            <button className="btn btn-default" onClick={() => this.props.stateMachineToDfa()}>
              NDFA <i style={{ float: 'none' }} className="icon icon-right" /> DFA
            </button>
          </li>
          <li style={{ padding: '10px', float: 'right' }}>
            <button className="btn btn-primary" onClick={() => this.props.stateMachineSave()}>
              Save
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
  stateMachineToDfa: () => {
    dispatch(stateMachineToDfa());
  },
  stateMachineSave: () => {
    dispatch(stateMachineSave());
  },
  startLoadVector: (filename) => {
    dispatch(startLoadTestVectorfile(filename));
  },
});

export default connect(mapStateToProps,
  mapDispatchToProps)(TestvectorList);
