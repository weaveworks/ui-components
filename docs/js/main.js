import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import getRoutes from './routes';

import '../css/demo.scss';

// webpack will make separate bundles for each of these contexts. They each get used to render
// components and their docs dynamically.
const componentCtx = require.context('../../src/components', true, /^((?!test|index|example).)*$/);
const exampleCtx = require.context('../../src/components', true, /example\.js$/);
const docCtx = require.context('!!react-docs!../../src/components', true, /^((?!test|index|example).)*$/);

const routes = getRoutes(componentCtx, exampleCtx, docCtx);

ReactDOM.render(
  <Root routes={routes} components={componentCtx} />,
  document.getElementById('demo')
);

module.hot.accept();
