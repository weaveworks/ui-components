import React from 'react';

import Shape, { curvedUnitPolygonPath } from './_Shape';

const renderTemplate = (attrs, { allowStroke = true } = {}) =>
  allowStroke ? (
    <path d={curvedUnitPolygonPath(3)} strokeDasharray="0.1, 0.05" {...attrs} />
  ) : (
    <path d={curvedUnitPolygonPath(3)} {...attrs} />
  );

export default class ShapeDottedTriangle extends React.Component {
  render() {
    return <Shape renderTemplate={renderTemplate} {...this.props} />;
  }
}
