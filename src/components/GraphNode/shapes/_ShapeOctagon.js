import React from 'react';

import Shape, { curvedUnitPolygonPath } from './_Shape';

const renderTemplate = attrs => (
  <path d={curvedUnitPolygonPath(8)} {...attrs} />
);

export default class ShapeOctagon extends React.Component {
  render() {
    return (
      <Shape
        type="octagon"
        renderTemplate={renderTemplate}
        {...this.props}
      />
    );
  }
}
