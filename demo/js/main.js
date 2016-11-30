import React from 'react';
import ReactDOM from 'react-dom';
import Root from './pages/Root';

import '../../src/styles/index.scss';
import '../css/markdown.css';
import '../css/syntax.css';
import '../css/demo.css';


ReactDOM.render(
  <Root />,
  document.getElementById('demo')
);

module.hot.accept();
