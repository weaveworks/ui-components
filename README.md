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
module.exports = {
  ...
  module: {
    loaders: [
      {
        test: /\.(scss|css)$/,
        loader: 'style-loader!css-loader!sass-loader'
      }
    ]
  },
  sassLoader: {
    includePaths: [
      path.resolve(__dirname, './node_modules/weaveworks-ui-components')
    ]
  }
  ...
}
```

To import styles:
```css
@import "~weaveworks-ui-components/styles.scss";
```
## Development
### Adding a component

1. Place your component in a `src/components/<component name>/` directory.
2. Add a file called `index.js` to your component directory. Add export statements, like so:
  ```javascript
  export Menu from './Menu';
  export MenuItem from './MenuItem';

  export default from './Menu';
  ```
3. Add some tests to the same directory with a `.test.js` suffix.
4. Document your module by adding comments. See the `<Button />` component for an example. The `react-docgen` library is used to parse comments, which are then rendered as markdown.
5. (Optional) Add an example implementation of your component in its directory. Call the file `example.js`. If no `example.js` file is added, the component itself (with default props) will be rendered in the component library UI.
6. Export the component from the library by adding an export statement to `src/components/index.js`. There is a unit test that will check that all components are exported; run tests using `npm test`.

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

## Adding Style Guide articles
To add a page to the style guide:

1. Add a markdown file to the `/styleguide` directory of this repo
2. ???
3. Profit
