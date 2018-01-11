/* eslint-disable react/jsx-no-bind*/
import React from 'react';
import CircularProgress from '.';

export default class Name extends React.Component {

  render() {
    return (
      <div>
        <CircularProgress size={35} />
        <CircularProgress inline /> Inline
        <CircularProgress center />
      </div>
    );
  }
}
