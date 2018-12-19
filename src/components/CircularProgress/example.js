/* eslint-disable react/jsx-no-bind */
import React from 'react';

import { Example, Info } from '../../utils/example';

import CircularProgress from '.';

export default class Name extends React.Component {
  render() {
    return (
      <div>
        <Example>
          <Info>Small</Info>
          <CircularProgress size="small" />
        </Example>
        <Example>
          <Info>Medium (Default)</Info>
          <CircularProgress />
        </Example>
        <Example>
          <Info>Aligned with inline text</Info>
          <CircularProgress inline /> I am right back
        </Example>
        <Example>
          <Info>Horizontally centered</Info>
          <CircularProgress center />
        </Example>
      </div>
    );
  }
}
