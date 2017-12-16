import React, { Component } from 'react';
import { connect } from 'react-redux';

class WordList extends Component {
  props: {
    words: Any,
    expectedWords: Any
  };

  constructor(props) {
    super(props);
    this.state = {
      showFinite: true
    };
  }

  render() {
    const renderRow = (word) => (
      <tr key={word.toString()}>
        <td>{ word }</td>
      </tr>
    );

    const activeButton = (active) => (active ? 'btn btn-default active': 'btn btn-default');

    const showFiniteWords = () => (
    <table className="table-striped">
      <thead>
        <tr>
          <th>Finite words</th>
        </tr>
      </thead>
      <tbody>
        { this.props.words.map(renderRow) }
      </tbody>
    </table>);

    const renderWordRow = (word) => (
      <tr key={word[0].toString()}>
        <td>
          <span className={word.length >= 3 ? (word[2] === word[1] ? 'icon icon-check' : 'icon icon-cancel'): '' } />
        </td>
        <td>{ word[0] }</td>
        <td>
          { word[1] ? 'Yes' : 'No' }
        </td>
      </tr>
    );

    const showTestWords = () => (
      <table className="table-striped">
        <thead>
          <tr>
            <th></th>
            <th>Word</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.expectedWords.map(renderWordRow) }
        </tbody>
      </table>);

    return (
      <div>
        <h5 className="nav-group-title">Words</h5>
        <div style={{ marginLeft: 8}} className="btn-group">
          <button className={activeButton(this.state.showFinite)} onClick={() => this.setState({showFinite : true}) }>
            <span className="icon icon-doc-text"></span>
          </button>
          <button className={activeButton(!this.state.showFinite)} onClick={() => this.setState({showFinite : false}) }>
            <span className="icon icon-lamp"></span>
          </button>
        </div>
        {this.state.showFinite ? showFiniteWords() : showTestWords()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  words: state.statemachinemeta.words,
  expectedWords: state.statemachinemeta.expectedWords,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps,
  mapDispatchToProps)(WordList);
