import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';

import 'font-awesome-webpack';

import theme from '../../src/theme';

import '../../src/fonts/proximanova-regular.woff';

import Root from './Root';

import '../css/demo.scss';
import '../img/favicon.ico';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Root />
  </ThemeProvider>,
  document.getElementById('demo')
);

if (module.hot) {
  module.hot.accept();
}
