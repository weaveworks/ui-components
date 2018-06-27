import React from 'react';

import Shape from './_Shape';

const renderTemplate = attrs => (
  <rect width="1.8" height="1.8" rx="0.4" ry="0.4" x="-0.9" y="-0.9" {...attrs} />
);

export default class ShapeSquare extends React.Component {
  render() {
    return (
      <Shape
        type="square"
        renderTemplate={renderTemplate}
        {...this.props}
      />
    );
  }
}
