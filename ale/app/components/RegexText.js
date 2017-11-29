import React, { Component } from 'react';
import { connect } from 'react-redux';
import { loadRegex } from '../actions/regex';

class RegexText extends Component {
  props: {
    loadRegex: (x: string) => void,
    passed: string
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
        <h5 className="nav-group-title">Regex</h5>
        <span className="nav-group-item">
          <input type="text" className="form-control" placeholder="" onChange={e => this.setState({ word: e.target.value })} />
        </span>
        <span className="nav-group-item">
          <button style={{ float: 'right' }} className="btn btn-form btn-primary" onClick={() => this.props.loadRegex(this.state.word)}>OK</button>
        </span>
        <span className="nav-group-item">
          {this.props.passed}
        </span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  passed: state.dynamicresult.regexerror,
});

const mapDispatchToProps = dispatch => ({
  loadRegex: word => {
    dispatch(loadRegex(word));
  }
});

export default connect(mapStateToProps,
  mapDispatchToProps)(RegexText);
