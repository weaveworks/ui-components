import React from 'react';
import { Router, browserHistory, hashHistory } from 'react-router';

import getRoutes from './routes';

const onS3 = window.location.href.indexOf('s3') !== -1;

// webpack will make separate bundles for each of these contexts. They each get used to render
// components and their docs dynamically.
const componentCtx = require.context('../../src/components', true, /^((?!test|index|example).)*$/);
const exampleCtx = require.context('../../src/components', true, /example\.js$/);
const docCtx = require.context('!!react-docs!../../src/components', true, /^((?!test|index|example).)*$/);

const routes = getRoutes(componentCtx, exampleCtx, docCtx);

class Root extends React.Component {
  getChildContext() {
    return {
      router: this.props.router,
      components: componentCtx
    };
  }
  render() {
    return (
      <Router history={onS3 ? hashHistory : browserHistory} routes={routes} />
    );
  }
}

Root.childContextTypes = {
  router: React.PropTypes.object,
  components: React.PropTypes.func
};

export default Root;
