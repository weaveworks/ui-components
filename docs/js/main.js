import React from 'react';
import ReactDOM from 'react-dom';
import Root from './pages/Root';

import '../css/demo.scss';


ReactDOM.render(
  <Root />,
  document.getElementById('demo')
);

module.hot.accept();
