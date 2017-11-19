import React, { Component } from 'react';
import { connect } from 'react-redux';

class StateMeta extends Component {
  props: {
    dfa: boolean
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
        <ul>
          <li>
            dfa: {this.props.dfa ? 'Yes' : 'No' }
          </li>
        </ul>
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
