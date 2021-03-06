// @flow
import React, { Component } from 'react';
import TestvectorList from './TestvectorList';
import StateMeta from './StateMeta';
import Graph from './Graph';
import InputText from './InputText';
import RegexText from './RegexText';
import WordList from './WordList';

export default class Home extends Component {
  render() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <TestvectorList />
        </header>
        <div className="window-content">
          <div className="pane-group">
            <div className="pane-sm sidebar">
              <nav className="nav-group">
                <StateMeta />
                <InputText />
                <RegexText />
                <WordList />
              </nav>
            </div>
            <div className="pane">
              <div data-tid="container">
                <Graph />
              </div>
            </div>
          </div>
        </div>
        <footer className="toolbar toolbar-footer">
          <h1 className="title">Automata and Process theory</h1>
        </footer>
      </div>
    );
  }
}
