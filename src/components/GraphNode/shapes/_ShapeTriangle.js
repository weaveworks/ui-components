import React from 'react';

import Shape, { curvedUnitPolygonPath } from './_Shape';

const renderTemplate = attrs => (
  <path d={curvedUnitPolygonPath(3)} {...attrs} />
);

export default class ShapeTriangle extends React.Component {
  render() {
    return (
      <Shape
        renderTemplate={renderTemplate}
        {...this.props}
      />
    );
  }
}
