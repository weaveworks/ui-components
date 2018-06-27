import React from 'react';

import Shape from './_Shape';

const renderTemplate = attrs => (
  <circle r="1" {...attrs} />
);

export default class ShapeCircle extends React.Component {
  render() {
    return (
      <Shape
        type="circle"
        renderTemplate={renderTemplate}
        {...this.props}
      />
    );
  }
}
