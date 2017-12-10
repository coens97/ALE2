import React, { Component } from 'react';
import { connect } from 'react-redux';

class StateMeta extends Component {
  props: {
    dfa: boolean,
    infinite: boolean
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <h5 className="nav-group-title">Meta</h5>
        <span className="nav-group-item">
          <span className="icon icon-check" />
          dfa: {this.props.dfa ? 'Yes' : 'No' }
        </span>
        <span className="nav-group-item">
          <span className="icon icon-check" />
          infinite: {this.props.infinite ? 'Yes' : 'No' }
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dfa: state.statemachinemeta.dfa,
  infinite: state.statemachinemeta.infinite
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps,
  mapDispatchToProps)(StateMeta);
