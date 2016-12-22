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

### Parallel development with LocalModuleProxy
It is possible to proxy module imports to a local copy of the `weaveworks-ui-components` repository to allow for parallel development. For example, if you want to add a new component to your project, but you want to re-use the component on other projects, you can do you can add a component in the `ui-components/src/components` directory, then add the `LocalModuleProxy` resolver plugin to your webpack config:

```javascript
const webpack = require('webpack');
const LocalModuleProxy = require('weaveworks-ui-components/resolvers').LocalModuleProxy;
const COMPONENT_LIB_PATH = '/Users/myusername/path/to/ui-components';

module.exports = {
  ...
  plugins: [
    new webpack.ResolverPlugin(new LocalModuleProxy({
      moduleName: 'weaveworks-ui-components',
      path: `${COMPONENT_LIB_PATH}/src/components/index.js`
    }))
  ]
}
```

Webpack will resolve imports that match `moduleName` from the path supplied to the `path` key. This should work for all webpack-related functionality, including hot reload.

One weird trick to remove the `COMPONENT_LIB_PATH` variable from version control:

In your `.bash_profile` or equivalent:
```
export COMPONENT_LIB_PATH="/absolute/path/to/ui-components"
```
In your `webpack.config.js`:
```javascript
module.exports = {
  ...
  plugins: [
    new webpack.ResolverPlugin(new LocalModuleProxy({
      moduleName: 'weaveworks-ui-components',
      path: `${process.env.COMPONENT_LIB_PATH}/src/components/index.js`
    }))
  ]
}
```

#### Exclude proxied modules from preLoaders
Since the request for `weaveworks-ui-components` is no longer resolving to `node_modules`, you may need to add an additional clause to the `exclude` option in your webpack `preLoaders`:
```javascript
// Change this:
preLoaders: [
  {
    test: /\.js$/,
    exclude: /node_modules|vendor/,
    loader: 'eslint-loader'
  }
]

// To this:
preLoaders: [
  {
    test: /\.js$/,
    exclude: new RegExp(`node_modules|vendor|${process.env.COMPONENT_LIB_PATH}`),
    loader: 'eslint-loader'
  }
],
```

#### Deploying to S3
Configure your AWS CLI tools: http://docs.aws.amazon.com/cli/latest/userguide/installing.html.

Then run `npm run s3`. Static files will get pushed when doing an `npm release` as well.

## Partial imports
It is possible to import a single component at a time using partial imports. This will allow webpack to do tree-shaking and keep bundle sizes smaller. Since the `weaveworks-ui-components` package is hosted on github (and not `npm`), you will need to add a resolver to your webpack configuration:
```javascript
const WeaveworksPartialImport = require('weaveworks-ui-components/resolvers').WeaveworksPartialImport;
module.exports = {
  ...
  plugins: [
    ...
    new webpack.ResolverPlugin(new WeaveworksPartialImport())
  ]
}
```
This will allow for partial imports, like so:
```javascript
import Button from 'weaveworks-ui-components/Button';
// is equivalent to
import { Button } from 'weaveworks-ui-components';
```
The `WeaveworksPartialImport` package will only work for the `weaveworks-ui-components` package, hence the Weaveworks-specific name
