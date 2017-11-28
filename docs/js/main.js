import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, injectGlobal } from 'styled-components';
import styledNormalize from 'styled-normalize';

import 'font-awesome-webpack';

import theme from '../../src/theme';

import '../../src/fonts/proximanova-regular.woff';

import Root from './Root';

import '../css/demo.scss';
import '../img/favicon.ico';

(() => injectGlobal`
  ${styledNormalize}

  /* https://github.com/necolas/normalize.css/issues/694 */
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
  }
`)();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Root />
  </ThemeProvider>,
  document.getElementById('demo')
);

if (module.hot) {
  module.hot.accept();
}
