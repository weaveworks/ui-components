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

### Adding a component

1. Place your component in a `src/components/<component name>/` directory.
2. Add some tests to the same directory with a `.test.js` suffix.
3. Document your module by adding comments. See the `<Button />` component for an example. The `react-docgen` library is used to parse comments, which are then rendered as markdown.
4. Add an import statement and `<Link />` to the `demo/ComponentList` module.
5. Add a route in the `demo/routes.js` module. Use the `!!react-docs!` webpack loader to generate the documentation
