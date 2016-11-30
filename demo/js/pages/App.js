import React from 'react';
import { Link } from 'react-router';

export default class DemoApp extends React.Component {
  render() {
    return (
      <div className="contents">
        <p>Here is some stuff to click on!</p>
        <Link to="components">Components</Link>
      </div>
    );
  }
}
