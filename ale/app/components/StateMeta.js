import React, { Component } from 'react';
import { connect } from 'react-redux';

class StateMeta extends Component {
  props: {
    dfa: boolean,
    infinite: boolean,
    expectedDfa: boolean,
    expectedInfinite: boolean
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const checkClass = success => (success ? 'icon icon-check' : 'icon icon-cancel');
    return (
      <div>
        <h5 className="nav-group-title">Meta</h5>
        <span className="nav-group-item">
          <span className={checkClass(this.props.expectedDfa === this.props.dfa)} />
          dfa: {this.props.dfa ? 'Yes' : 'No' }
        </span>
        <span className="nav-group-item">
          <span className={checkClass(this.props.expectedInfinite === this.props.infinite)} />
          infinite: {this.props.infinite ? 'Yes' : 'No' }
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dfa: state.statemachinemeta.dfa,
  infinite: state.statemachinemeta.infinite,
  expectedDfa: state.statemachinemeta.expectedDfa,
  expectedInfinite: state.statemachinemeta.expectedInfinite,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps,
  mapDispatchToProps)(StateMeta);
