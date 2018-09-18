import React from 'react';
import { Router, browserHistory, hashHistory } from 'react-router';
import PropTypes from 'prop-types';

import getRoutes from './routes';

const onS3 = window.location.href.indexOf('s3') !== -1;

// webpack will make separate bundles for each of these contexts. They each get used to render
// components and their docs dynamically.
const componentCtx = require.context(
  '../../src/components',
  true,
  /^((?!test|index|example|_).)*$/
);
const exampleCtx = require.context(
  '../../src/components',
  true,
  /example\.js$/
);
const docCtx = require.context(
  '!babel-loader!react-docs!../../src/components',
  true,
  /^((?!test|index|example|_).)*$/
);
const styleGuideCtx = require.context('../../styleguide', true, /\.js$/);

const routes = getRoutes(componentCtx, exampleCtx, docCtx, styleGuideCtx);

class Root extends React.Component {
  getChildContext() {
    return {
      router: this.props.router,
      components: componentCtx,
      styles: styleGuideCtx,
    };
  }
  render() {
    return (
      <Router history={onS3 ? hashHistory : browserHistory} routes={routes} />
    );
  }
}

Root.childContextTypes = {
  router: PropTypes.object,
  components: PropTypes.func,
  styles: PropTypes.func,
};

export default Root;
