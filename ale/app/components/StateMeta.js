import React, { Component } from 'react';
import { connect } from 'react-redux';

class StateMeta extends Component {
  props: {
    dfa: boolean
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <span className="nav-group-item">
          <span className="icon icon-check"></span>
          dfa: {this.props.dfa ? 'Yes' : 'No' }
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dfa: state.statemachinemeta.dfa,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps,
  mapDispatchToProps)(StateMeta);
