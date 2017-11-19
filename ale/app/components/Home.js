// @flow
import React, { Component } from 'react';
import TestvectorList from './TestvectorList';
import StateMeta from './StateMeta';
import Graph from './Graph';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <TestvectorList />
          <StateMeta />
          <Graph />
        </div>
      </div>
    );
  }
}
