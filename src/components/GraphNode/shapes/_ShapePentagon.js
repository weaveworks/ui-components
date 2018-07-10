import React from 'react';

import Shape, { curvedUnitPolygonPath } from './_Shape';

const renderTemplate = attrs => (
  <path d={curvedUnitPolygonPath(5)} {...attrs} />
);

export default class ShapePentagon extends React.Component {
  render() {
    return <Shape renderTemplate={renderTemplate} {...this.props} />;
  }
}
