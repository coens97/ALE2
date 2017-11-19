import React, { Component } from 'react';
import { connect } from 'react-redux';
import Viz from 'viz.js';
import HTMLReactParser from 'react-html-parser';

class Graph extends Component {
  props: {
    dot: string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        {HTMLReactParser(Viz('digraph { a -> d; a -> v}', { format: 'svg', scale: 2 }))}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  dot: state.statemachinemeta.dot,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps,
  mapDispatchToProps)(Graph);
