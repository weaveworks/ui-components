## Installation
`npm i --save https://github.com/weaveworks/ui-components`

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import 'weave-ui-components/styles/components.css';
import { WeaveLogo } from 'weave-ui-components';

ReactDOM.render(
  <WeaveLogo />,
  document.getElementById('logo')
);
```

## Development
### Adding a component

1. Place your component in a `src/components/<component name>/` directory.
2. Add some tests to the same directory with a `.test.js` suffix.
3. Document your module by adding comments. See the `<Button />` component for an example. The `react-docgen` library is used to parse comments, which are then rendered as markdown.
4. (Optional) Add an example implementation of your component in its directory. Call the file `example.js`;

To develop a component locally, start the `webpack-dev-server` using `npm start`. Any components in the `src/components` directory will auto-magically be visible in the left-hand navigation. Editing a component will hot-reload it in the page. NOTE: when adding a component file for the first time, you will need to restart the `webpack-dev-server` to see the component appear in the navigation.
