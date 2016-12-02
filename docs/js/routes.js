/* eslint-disable import/first, import/no-unresolved, import/extensions*/
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import { includes } from 'lodash';

import App from './pages/App';
import RouterComponent from './components/RouterComponent';
import Example from './components/Example';

import examples from './examples';
import docs from './docs';
import components from './components';

function buildExampleComponent(el, doc, example) {
  return function ExampleWrapper() {
    return (
      <Example
        name={el.name}
        element={el}
        example={example}
        doc={doc}
      />
    );
  };
}

export default function getRoutes() {
  const availableExamples = examples.keys();
  return (
    <Route name="app" path="/" component={RouterComponent}>
      <Route path="components" component={App}>
        {components.keys().map((resource) => {
          const name = resource.split('/').pop();
          const component = components(resource).default;
          const doc = docs(`${resource}`);
          const example = includes(availableExamples, `./${name}/example.js`)
            ? examples(`./${name}/example.js`).default
            : null;
          return (
            <Route
              key={name}
              path={name.replace('.js', '').toLowerCase()}
              component={buildExampleComponent(component, doc, example)}
            />
          );
        })}
      </Route>
      <IndexRedirect to="components" />
    </Route>
  );
}
