[![npm version](https://badge.fury.io/js/weaveworks-ui-components.svg)](https://badge.fury.io/js/weaveworks-ui-components)
[![Circle CI](https://circleci.com/gh/weaveworks/ui-components/tree/master.svg?style=shield)](https://circleci.com/gh/weaveworks/ui-components/tree/master)

See it in action:

https://ui-components.weave.works/

## Prerequisites

- [![@fortawesome/fontawesome-free](https://img.shields.io/npm/dependency-version/weaveworks-ui-components/peer/@fortawesome/fontawesome-free.svg)](https://github.com/weaveworks/ui-components/blob/master/package.json)
- [![lodash](https://img.shields.io/npm/dependency-version/weaveworks-ui-components/peer/lodash.svg)](https://github.com/weaveworks/ui-components/blob/master/package.json)
- [![moment](https://img.shields.io/npm/dependency-version/weaveworks-ui-components/peer/moment.svg)](https://github.com/weaveworks/ui-components/blob/master/package.json)
- [![react](https://img.shields.io/npm/dependency-version/weaveworks-ui-components/peer/react.svg)](https://github.com/weaveworks/ui-components/blob/master/package.json)
- [![react-dom](https://img.shields.io/npm/dependency-version/weaveworks-ui-components/peer/react-dom.svg)](https://github.com/weaveworks/ui-components/blob/master/package.json)
- [![styled-components](https://img.shields.io/npm/dependency-version/weaveworks-ui-components/peer/styled-components.svg)](https://github.com/weaveworks/ui-components/blob/master/package.json)

## Installation
`yarn add weaveworks-ui-components`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import { WeaveLogo } from 'weaveworks-ui-components';
import theme from 'weaveworks-ui-components/lib/theme';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <WeaveLogo />
  </ThemeProvider>,
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
### Commit message format

This project follows the <a href="https://www.conventionalcommits.org" target="_blank">Conventional Commits</a> specification.
A pre-commit hook is configured to enforce following this format of commit message.
But don't worry its quite simple! Check out the <a href="https://www.conventionalcommits.org" target="_blank">Conventional Commits</a> website for a couple of example messages.


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

You can also proxy multiple modules by adding a lookup to the `modules` key in the `LocalModuleProxy` constructor:

```javascript
plugins: [
  new webpack.ResolverPlugin(new LocalModuleProxy({
    enabled: true,
    modules: {
      'weave-scope/reducer': `${SCOPE_COMPONENT_PATH}/client/app/scripts/reducers/root.js`,
      'weave-scope/component' : `${SCOPE_COMPONENT_PATH}/client/app/scripts/components/app.js`
    }
  }))
]
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

#### Releasing this repo
Configure your AWS CLI tools: http://docs.aws.amazon.com/cli/latest/userguide/installing.html.

Run `yarn release` to cut a new release, this will also generate and commit the CHANGELOG.md automatically.

If everything is ok, you can publish the release to github and npm with `yarn publish`, entering the new version you just created.
This will build, publish and then push static files to S3 for the docs site.

## Adding Style Guide articles
To add a page to the style guide:

1. Add a markdown file to the `/styleguide` directory of this repo
2. ???
3. Profit


## <a name="help"></a>Getting Help

If you have any questions about, feedback for or problems with `ui-components`:

- Invite yourself to the <a href="https://slack.weave.works" target="_blank"> Weave Users Slack </a> slack.
- Ask a question on the <a href="https://weave-community.slack.com/messages/general/"> #general</a> slack channel.
- <a href="https://github.com/weaveworks/ui-components/issues/new">File an issue.</a>

Weaveworks follows the [CNCF Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md). Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting a Weaveworks project maintainer, or Alexis Richardson (alexis@weave.works).

Your feedback is always welcome!
