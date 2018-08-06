import React from 'react';
import PropTypes from 'prop-types';
import { noop, keys } from 'lodash';
import { spring, Motion } from 'react-motion';

import theme from '../../theme';

import GraphNodeStatic, { shapes, nodeBaseSize } from './_GraphNodeStatic';

function weakSpring(value) {
  return spring(value, { stiffness: 100, damping: 18, precision: 1 });
}

/**
 * A component for rendering labeled graph nodes.
 */
class GraphNode extends React.PureComponent {
  renderNode(props) {
    const { x, y, size, graphNodeRef, ...otherProps } = props;
    return (
      <g
        ref={graphNodeRef}
        transform={`translate(${x},${y}) scale(${size / nodeBaseSize})`}
      >
        <GraphNodeStatic {...otherProps} />
      </g>
    );
  }

  render() {
    if (!this.props.isAnimated) {
      return this.renderNode(this.props);
    }

    return (
      // Animate only the position and size props.
      <Motion
        style={{
          x: weakSpring(this.props.x),
          y: weakSpring(this.props.y),
          size: weakSpring(this.props.size),
        }}
      >
        {interpolated =>
          this.renderNode({
            ...this.props,
            ...interpolated,
          })
        }
      </Motion>
    );
  }
}

GraphNode.propTypes = {
  /**
   * A unique node ID
   */
  id: PropTypes.string.isRequired,
  /**
   * Shape of the rendered node (e.g. 'hexagon')
   */
  shape: PropTypes.oneOf(keys(shapes)).isRequired,
  /**
   * The node main label displayed right under the node shape
   */
  label: PropTypes.string.isRequired,
  /**
   * Secondary label displayed below the main label in a smaller font
   */
  labelMinor: PropTypes.string,
  /**
   * Vertical offset (in pixels) of the labels
   */
  labelOffset: PropTypes.number,
  /**
   * Shows a stack of nodes instead of a singular node if true
   */
  stacked: PropTypes.bool,
  /**
   * If true, shows the glow around the node as well as its metric data
   */
  highlighted: PropTypes.bool,
  /**
   * The color of the node in any of the standard formats
   */
  color: PropTypes.string,
  /**
   * The radius of the shape in pixels
   */
  size: PropTypes.number,
  /**
   * Animates the node motion if true
   */
  isAnimated: PropTypes.bool,
  /**
   * Renders the node in a high contrast mode
   */
  contrastMode: PropTypes.bool,
  /**
   * Displays all the node labels as SVG elements
   */
  forceSvg: PropTypes.bool,
  /**
   * The background color of the node metric fill
   */
  metricColor: PropTypes.string,
  /**
   * The formatted metric value to be displayed inside the node when highlighted
   */
  metricFormattedValue: PropTypes.string,
  /**
   * The numeric value in the interval [0, 1] representing the amount of metric fill
   */
  metricNumericValue: PropTypes.number,
  /**
   * Search terms to be applied on the node
   */
  searchTerms: PropTypes.arrayOf(PropTypes.string),
  /**
   * The cursor type shown on hovering over the node
   */
  cursorType: PropTypes.string,
  /**
   * Render function for the info to be displayed before node labels (not working in full SVG mode)
   */
  renderPrependedInfo: PropTypes.func,
  /**
   * Render function for the info to be displayed after node labels (not working in full SVG mode)
   */
  renderAppendedInfo: PropTypes.func,
  /**
   * A callback to which the GraphNode `ref` will be passed.
   */
  graphNodeRef: PropTypes.func,
  /**
   * Callback for mouse pointer entering the node
   */
  onMouseEnter: PropTypes.func,
  /**
   * Callback for mouse pointer leaving the node
   */
  onMouseLeave: PropTypes.func,
  /**
   * Callback for mouse click on the node
   */
  onClick: PropTypes.func,
  /**
   * x-coordinate position of the node
   */
  x: PropTypes.number,
  /**
   * y-coordinate position of the node
   */
  y: PropTypes.number,
};

GraphNode.defaultProps = {
  labelMinor: '',
  labelOffset: 0,
  stacked: false,
  highlighted: false,
  color: theme.colors.purple400,
  size: nodeBaseSize,
  isAnimated: false,
  contrastMode: false,
  forceSvg: false,
  metricColor: theme.colors.status.warning,
  metricFormattedValue: '',
  metricNumericValue: NaN,
  searchTerms: [],
  cursorType: 'pointer',
  renderPrependedInfo: noop,
  renderAppendedInfo: noop,
  graphNodeRef: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
  onClick: noop,
  x: 0,
  y: 0,
};

export default GraphNode;
