import React, { Component } from 'react';
import { connect } from 'react-redux';

class WordList extends Component {
  props: {
    words: string[]
  };

  constructor(props) {
    super(props);
    this.state = {
      word: ''
    };
  }

  render() {
    const renderRow = (word) => (
      <tr>
        <td>{ word }</td>
      </tr>
    );
    return (
      <div>
        <h5 className="nav-group-title">Finite words</h5>
        <table className="table-striped">
          <thead>
            <tr>
              <th>Word</th>
            </tr>
          </thead>
          <tbody>
            { this.props.words.map(renderRow) }
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  words: state.statemachinemeta.words,
});

const mapDispatchToProps = () => ({
});

export default connect(mapStateToProps,
  mapDispatchToProps)(WordList);
