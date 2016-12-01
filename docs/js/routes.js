/* eslint-disable import/first, import/no-unresolved, import/extensions*/
import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

// import ComponentsPage from './pages/ComponentsPage';
import App from './pages/App';
import RouterComponent from './components/RouterComponent';
import Example from './components/Example';

import Button from '../../src/components/Button';
import ButtonDoc from '!!react-docs!../../src/components/Button/Button.js';

import Grid from '../../src/components/Grid';
import GridDoc from '!!react-docs!../../src/components/Grid/Grid.js';
import GridExample from '../../src/components/Grid/example';

import MenuItemDoc from '!!react-docs!../../src/components/Menu/MenuItem.js';
import MenuExample from '../../src/components/Menu/example';

import Logo from '../../src/components/Logo/';
import LogoDoc from '!!react-docs!../../src/components/Logo/Logo.js';

function buildExampleComponent(el, doc, example) {
  return function ExampleWrapper() {
    return (
      <Example doc={doc} element={el} example={example} />
    );
  };
}

export default function getRoutes() {
  // Build this here to use as the index route and as the /logo route.
  // This is a placeholder for a real landing page.
  const logo = buildExampleComponent(Logo, LogoDoc);
  return (
    <Route name="app" path="/" component={RouterComponent}>
      <Route path="components" component={App}>
        <IndexRoute component={logo} />
        <Route path="logo" component={logo} />
        <Route path="button" component={buildExampleComponent(Button, ButtonDoc)} />
        <Route path="grid" component={buildExampleComponent(Grid, GridDoc, GridExample)} />
        <Route path="menu" component={buildExampleComponent(null, MenuItemDoc, MenuExample)} />
      </Route>
      <IndexRedirect to="components" />
    </Route>
  );
}
