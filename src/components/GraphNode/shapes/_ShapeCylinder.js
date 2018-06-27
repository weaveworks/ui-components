import React from 'react';

import Shape from './_Shape';

const UNIT_CYLINDER_PATH = 'm -1 -1.25' // this line is responsible for adjusting place of the shape with respect to dot
  + 'a 1 0.4 0 0 0 2 0'
  + 'm -2 0'
  + 'v 1.8'
  + 'a 1 0.4 0 0 0 2 0'
  + 'v -1.8'
  + 'a 1 0.4 0 0 0 -2 0';

const renderTemplate = attrs => (
  <path d={UNIT_CYLINDER_PATH} {...attrs} />
);

export default class ShapeCylinder extends React.Component {
  render() {
    return (
      <Shape
        type="cylinder"
        renderTemplate={renderTemplate}
        {...this.props}
      />
    );
  }
}
