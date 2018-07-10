import React from 'react';

import Shape from './_Shape';

const UNIT_SHEET =
  'm -1.2 -1.6 m 0.4 0 v 2.4 m -0.4 -2.4 v 2.4 h 2 v -2.4 z m 0 0.4 h 2';

const renderTemplate = attrs => <path d={UNIT_SHEET} {...attrs} />;

export default class ShapeSheet extends React.Component {
  render() {
    return <Shape renderTemplate={renderTemplate} {...this.props} />;
  }
}
