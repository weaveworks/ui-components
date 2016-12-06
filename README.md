## Prerequisites
* `React` & `ReactDOM` ~15.4.0
* `lodash` ^4.17.0

## Installation
`npm i --save https://github.com/weaveworks/ui-components`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

import { WeaveLogo } from 'weaveworks-ui-components';

ReactDOM.render(
  <WeaveLogo />,
  document.getElementById('logo')
);
```

### Importing Styles
To import the stylesheets, you must have a webpack Sass loader configured:
```javascript
module: {
  loaders: [
    {
      test: /\.(scss|css)$/,
      loader: 'style-loader!css-loader!sass-loader'
    }
  ]
}
```

To import styles:
```javascript
import 'weaveworks-ui-components/styles';
```
## Development
### Adding a component

1. Place your component in a `src/components/<component name>/` directory.
2. Add some tests to the same directory with a `.test.js` suffix.
3. Document your module by adding comments. See the `<Button />` component for an example. The `react-docgen` library is used to parse comments, which are then rendered as markdown.
4. (Optional) Add an example implementation of your component in its directory. Call the file `example.js`;

To develop a component locally, start the `webpack-dev-server` using `npm start`. Any components in the `src/components` directory will auto-magically be visible in the left-hand navigation. Editing a component will hot-reload it in the page. NOTE: when adding a component file for the first time, you will need to restart the `webpack-dev-server` to see the component appear in the navigation.

#### Example Implementation
Here is how to set up a webpack project that uses the `weaveworks-ui-components` package.

`package.json`
```json
{
  "name": "my-project",
  "scripts": {
    "build": "webpack"
  },
  "dependencies": {
    "lodash": "^4.17.2",
    "react": "~15.4.0",
    "react-dom": "~15.4.0",
    "weaveworks-ui-components": "https://github.com/weaveworks/ui-components"
  },
  "devDependencies": {
    "babel-loader": "^6.2.8",
    "css-loader": "^0.26.1",
    "sass-loader": "^4.0.2",
    "style-loader": "^0.13.1",
    "webpack": "~1.13.3"
  }
}
```

`webpack.config.js`
```javascript
module.exports = {
  entry: {
    app: './src/components/App.js'
  },
  output: {
    path: 'dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.(scss|css)$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.js?$/,
        loaders: ['babel-loader']
      }
    ]
  }
}
```
`src/components/App.js`
```javascript
const React = require('react');
const ReactDOM = require('react-dom');

require('weaveworks-ui-components/styles');

const WeaveComponents = require('weaveworks-ui-components');

const App = React.createElement('div', { className: 'my-app' }, [
  React.createElement(WeaveComponents.Logo)
]);

ReactDOM.render(App, document.getElementById('app'));

```
