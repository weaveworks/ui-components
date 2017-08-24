### Intro

The Weaveworks Design style guide! Adding articles to the style guide: https://github.com/weaveworks/ui-components#adding-style-guide-articles

For new components you need to use the ThemeProvider:

```javascript
import { ThemeProvider } from 'styled-components';
import theme from 'weaveworks-ui-components/theme';

const App = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);
```
