import React from 'react';

import Shape, { curvedUnitPolygonPath } from './_Shape';

const renderTemplate = (attrs, { allowStroke = true } = {}) =>
  allowStroke ? (
    <path d={curvedUnitPolygonPath(3)} strokeDasharray="0.4, 0.2" {...attrs} />
  ) : (
    <path d={curvedUnitPolygonPath(3)} {...attrs} />
  );

export default class ShapeDottedTriangle extends React.Component {
  render() {
    return <Shape renderTemplate={renderTemplate} {...this.props} />;
  }
}
