import React from 'react';
import PropTypes from 'prop-types';
import { noop, keys } from 'lodash';
import { spring, Motion } from 'react-motion';

import theme from '../../theme';

import GraphNodeStatic, {
  shapes,
  tags,
  nodeBaseSize,
} from './_GraphNodeStatic';

function weakSpring(value) {
  return spring(value, { damping: 18, precision: 1, stiffness: 100 });
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
          size: weakSpring(this.props.size),
          x: weakSpring(this.props.x),
          y: weakSpring(this.props.y),
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
   * The color of the node in any of the standard formats
   */
  color: PropTypes.string,
  /**
   * Renders the node in a high contrast mode
   */
  contrastMode: PropTypes.bool,
  /**
   * The cursor type shown on hovering over the node
   */
  cursorType: PropTypes.string,
  /**
   * Displays all the node labels as SVG elements
   */
  forceSvg: PropTypes.bool,
  /**
   * A callback to which the GraphNode `ref` will be passed.
   */
  graphNodeRef: PropTypes.func,
  /**
   * If true, shows the glow around the node as well as its metric data
   */
  highlighted: PropTypes.bool,
  /**
   * A unique node ID
   */
  id: PropTypes.string.isRequired,
  /**
   * Animates the node motion if true
   */
  isAnimated: PropTypes.bool,
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
   * Callback for mouse click on the node
   */
  onClick: PropTypes.func,
  /**
   * Callback for mouse pointer entering the node
   */
  onMouseEnter: PropTypes.func,
  /**
   * Callback for mouse pointer leaving the node
   */
  onMouseLeave: PropTypes.func,
  /**
   * Render function for the info to be displayed after node labels (not working in full SVG mode)
   */
  renderAppendedInfo: PropTypes.func,
  /**
   * Render function for the info to be displayed before node labels (not working in full SVG mode)
   */
  renderPrependedInfo: PropTypes.func,
  /**
   * Search terms to be applied on the node
   */
  searchTerms: PropTypes.arrayOf(PropTypes.string),
  /**
   * Shape of the rendered node (e.g. 'hexagon')
   */
  shape: PropTypes.oneOf(keys(shapes)).isRequired,
  /**
   * The radius of the shape in pixels
   */
  size: PropTypes.number,
  /**
   * Shows a stack of nodes instead of a singular node if true
   */
  stacked: PropTypes.bool,
  /**
   * An optional tag icon attached to the shape
   */
  tag: PropTypes.oneOf(keys(tags)),
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
  color: theme.colors.purple400,
  contrastMode: false,
  cursorType: 'pointer',
  forceSvg: false,
  graphNodeRef: undefined,
  highlighted: false,
  isAnimated: false,
  labelMinor: '',
  labelOffset: 0,
  metricColor: theme.colors.yellow500,
  metricFormattedValue: '',
  metricNumericValue: NaN,
  onClick: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
  renderAppendedInfo: noop,
  renderPrependedInfo: noop,
  searchTerms: [],
  size: nodeBaseSize,
  stacked: false,
  tag: 'none',
  x: 0,
  y: 0,
};

export default GraphNode;
