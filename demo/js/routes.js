/* eslint-disable import/first, import/no-unresolved, import/extensions*/
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import ComponentsPage from './pages/ComponentsPage';
import App from './pages/App';
import RouterComponent from './components/RouterComponent';
import Example from './components/Example';

import Button from '../../src/components/Button';
import ButtonDoc from '!!react-docs!../../src/components/Button/Button.js';
import Grid from '../../src/components/Grid';
import GridDoc from '!!react-docs!../../src/components/Grid/Grid.js';
import GridExample from '../../src/components/Grid/example';

function buildExampleComponent(el, doc, example) {
  return function ExampleWrapper() {
    return (
      <Example doc={doc} element={el} example={example} />
    );
  };
}

export default function getRoutes() {
  return (
    <Route name="app" path="/" component={RouterComponent}>
      <IndexRoute component={App} />
      <Route path="components" component={ComponentsPage}>
        <Route path="button" component={buildExampleComponent(Button, ButtonDoc)} />
        <Route path="grid" component={buildExampleComponent(Grid, GridDoc, GridExample)} />
      </Route>
    </Route>
  );
}
