import React from 'react';
import { Router, browserHistory } from 'react-router';
import getRoutes from '../routes';

const routes = getRoutes();

export default class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory} routes={routes} />
    );
  }
}
