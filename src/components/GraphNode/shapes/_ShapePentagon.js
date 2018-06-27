import React from 'react';

import Shape, { curvedUnitPolygonPath } from './_Shape';

const renderTemplate = attrs => (
  <path d={curvedUnitPolygonPath(5)} {...attrs} />
);

export default class ShapeHexagon extends React.Component {
  render() {
    return (
      <Shape
        type="pentagon"
        renderTemplate={renderTemplate}
        {...this.props}
      />
    );
  }
}
