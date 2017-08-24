import React from 'react';
import ReactDOM from 'react-dom';

import 'font-awesome-webpack';

import Root from './Root';

import '../css/demo.scss';
import '../img/favicon.ico';

ReactDOM.render(
  <Root />,
  document.getElementById('demo')
);

if (module.hot) {
  module.hot.accept();
}
