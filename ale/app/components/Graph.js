import React, { Component } from 'react';
import { connect } from 'react-redux';
import Viz from 'viz.js';
import DOMPurify from 'dompurify';

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
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(Viz(this.props.dot, { format: 'svg', scale: 2 })) }} />
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
