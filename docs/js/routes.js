/* eslint-disable import/first, import/no-unresolved, import/extensions*/
import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import { includes } from 'lodash';

import App from './App';
import Example from './Example';

function buildExampleComponent(el, doc, example, sub) {
  return function ExampleWrapper() {
    return (
      <Example
        name={el.name}
        element={el}
        example={example}
        doc={doc}
        isSubComponent={sub}
      />
    );
  };
}

// Don't render an example panel if the component is not the top-level component.
function isSubComponent(resource) {
  const [dir, module] = resource.split('/').filter(n => n !== '.');
  return dir !== module;
}

export default function getRoutes(components, examples, docs) {
  const availableExamples = examples.keys();
  return (
    <Route path="/" component={App}>
      <Route path="components">
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
              component={buildExampleComponent(component, doc, example, isSubComponent(resource))}
            />
          );
        })}
      </Route>
      <IndexRedirect to="components" />
    </Route>
  );
}
