import React from 'react';
import PropTypes from 'prop-types';

import ShapePentagon from './shapes/_ShapePentagon';
import ShapeHexagon from './shapes/_ShapeHexagon';

const shapeMap = {
  pentagon: ShapePentagon,
  hexagon: ShapeHexagon,
};

class GraphNode extends React.Component {
  render() {
    const Shape = shapeMap[this.props.type];
    return (
      <Shape
        id="blublu"
        color="#484"
        size={this.props.size}
      />
    );
  }
}

GraphNode.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.number,
};

GraphNode.defaultProps = {
  size: 80,
};

export default GraphNode;
