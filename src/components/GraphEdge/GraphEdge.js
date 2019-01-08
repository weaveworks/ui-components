import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { line, curveBasis } from 'd3-shape';
import { range, times, noop, each, size } from 'lodash';
import { spring, Motion } from 'react-motion';

import { encodeIdAttribute } from '../../utils/dom';

function weakSpring(value) {
  return spring(value, { damping: 18, precision: 1, stiffness: 100 });
}

const spline = line()
  .curve(curveBasis)
  .x(d => d.x)
  .y(d => d.y);

const EdgeShadow = styled.path.attrs({
  // Animation optimization.
  style: ({ thickness }) => ({ strokeWidth: 10 * thickness }),
})`
  stroke: ${props => props.theme.colors.blue400};
  stroke-opacity: 0;
  fill: none;

  ${props =>
    props.highlighted &&
    `
      stroke-opacity: ${props.contrastMode ? 0.3 : 0.1};
    `};
`;

const EdgeDotted = styled.path`
  stroke: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple500};
  stroke-dasharray: 1, 30;
  stroke-linecap: round;
  stroke-width: 5;
  fill: none;
`;

const EdgeLine = styled.path.attrs({
  // Animation optimization.
  style: ({ thickness }) => ({ strokeWidth: thickness }),
})`
  stroke: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple500};
  fill: none;
`;

const EdgeArrowPolygon = styled.polygon`
  fill: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple500};
`;

const EdgeArrowDefinition = ({ id, offset, thickness, contrastMode }) => (
  <defs>
    <marker
      id={id}
      refY="3.5"
      refX={offset / thickness}
      markerWidth={15 / thickness}
      markerHeight={15 / thickness}
      viewBox="1 0 10 10"
      orient="auto"
    >
      <EdgeArrowPolygon points="0 0, 10 3.5, 0 7" contrastMode={contrastMode} />
    </marker>
  </defs>
);

// Converts a waypoints map of the format { x0: 11, y0: 22, x1: 33, y1: 44 }
// that is used by Motion to an array of waypoints in the format
// [{ x: 11, y: 22 }, { x: 33, y: 44 }] that can be used by D3.
const waypointsMapToArray = waypointsMap =>
  range(size(waypointsMap) / 2).map(index => ({
    x: waypointsMap[`x${index}`],
    y: waypointsMap[`y${index}`],
  }));

// Converts a waypoints array of the input format [{ x: 11, y: 22 }, { x: 33, y: 44 }]
// to an array of waypoints that is used by Motion in the format { x0: 11, y0: 22, x1: 33, y1: 44 }.
const waypointsArrayToMap = waypointsArray => {
  const waypointsMap = {};
  each(waypointsArray, (waypoint, index) => {
    waypointsMap[`x${index}`] = weakSpring(waypoint.x);
    waypointsMap[`y${index}`] = weakSpring(waypoint.y);
  });
  return waypointsMap;
};

/**
 * A component for rendering edges that connect the graph nodes.
 */
class GraphEdge extends React.PureComponent {
  state = {
    waypointsMap: [],
  };

  componentWillMount() {
    if (this.props.isAnimated) {
      this.prepareWaypointsForMotion(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    // immutablejs allows us to `===`! \o/
    const waypointsChanged = this.props.waypoints !== nextProps.waypoints;
    const animationChanged = this.props.isAnimated !== nextProps.isAnimated;
    if (waypointsChanged || animationChanged) {
      this.prepareWaypointsForMotion(nextProps);
    }
  }

  prepareWaypointsForMotion({ waypoints, waypointsCap, isAnimated }) {
    // Don't update if the edges are not animated.
    if (!isAnimated) return;

    // The Motion library requires the number of waypoints to be constant, so we fill in for
    // the missing ones by reusing the edge source point, which doesn't affect the edge shape
    // because of how the curveBasis interpolation is done.
    const waypointsMissing = waypointsCap - size(waypoints);
    if (waypointsMissing > 0) {
      waypoints = times(waypointsMissing, () => waypoints[0]).concat(waypoints);
    }

    this.setState({ waypointsMap: waypointsArrayToMap(waypoints) });
  }

  renderEdge(props) {
    const {
      id,
      encodedArrowId,
      waypoints,
      thickness,
      withArrow,
      arrowOffset,
      isDotted,
      highlighted,
      contrastMode,
      graphEdgeRef,
    } = props;

    const arrowThickness = Math.sqrt(thickness);
    const path = spline(waypoints);

    return (
      <g
        ref={graphEdgeRef}
        onMouseEnter={ev => props.onMouseEnter(id, ev)}
        onMouseLeave={ev => props.onMouseLeave(id, ev)}
      >
        {withArrow && (
          <EdgeArrowDefinition
            id={encodedArrowId}
            thickness={arrowThickness}
            offset={arrowOffset}
            contrastMode={contrastMode}
          />
        )}
        <EdgeShadow
          d={path}
          highlighted={highlighted}
          thickness={thickness}
          contrastMode={contrastMode}
        />
        {isDotted && <EdgeDotted d={path} contrastMode={contrastMode} />}
        <EdgeLine
          d={path}
          thickness={thickness}
          contrastMode={contrastMode}
          markerEnd={withArrow ? `url(#${encodedArrowId})` : null}
        />
      </g>
    );
  }

  render() {
    const { isAnimated, ...otherProps } = this.props;
    const encodedArrowId = `end-arrow-${encodeIdAttribute(this.props.id)}`;

    if (!isAnimated) {
      return this.renderEdge({
        ...otherProps,
        encodedArrowId,
      });
    }

    return (
      // For the Motion interpolation to work, the waypoints need to be in a map format like
      // { x0: 11, y0: 22, x1: 33, y1: 44 } that we convert to the array format when rendering.
      <Motion
        style={{
          ...this.state.waypointsMap,
          interpolatedArrowOffset: weakSpring(this.props.arrowOffset),
          interpolatedThickness: weakSpring(this.props.thickness),
        }}
      >
        {({
          interpolatedThickness,
          interpolatedArrowOffset,
          ...interpolatedWaypoints
        }) =>
          this.renderEdge({
            ...otherProps,
            arrowOffset: interpolatedArrowOffset,
            encodedArrowId,
            thickness: interpolatedThickness,
            waypoints: waypointsMapToArray(interpolatedWaypoints),
          })
        }
      </Motion>
    );
  }
}

GraphEdge.propTypes = {
  /**
   * Distance from the target point (tweak this to pull the arrow out of the rendered node)
   */
  arrowOffset: PropTypes.number,
  /**
   * Renders the edge in a high contrast mode
   */
  contrastMode: PropTypes.bool,
  /**
   * A callback to which the GraphNode `ref` will be passed.
   */
  graphEdgeRef: PropTypes.func,
  /**
   * Shows the blue shadow around the edge if true
   */
  highlighted: PropTypes.bool,
  /**
   * A unique edge ID
   */
  id: PropTypes.string.isRequired,
  /**
   * Animates the edge motion if true
   */
  isAnimated: PropTypes.bool,
  /**
   * Shows extra dots on the edge path if true
   */
  isDotted: PropTypes.bool,
  /**
   * Callback for mouse pointer entering the edge
   */
  onMouseEnter: PropTypes.func,
  /**
   * Callback for mouse pointer leaving the edge
   */
  onMouseLeave: PropTypes.func,
  /**
   * Thickness of the rendered edge line
   */
  thickness: PropTypes.number,
  /**
   * A list of points in the { x, y } format describing the edge path
   */
  waypoints: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ).isRequired,
  /**
   * A number of waypoints to cap to in case the edge is animated
   */
  waypointsCap: PropTypes.number,
  /**
   * Draws a one-way arrow on the edge if true
   */
  withArrow: PropTypes.bool,
};

GraphEdge.defaultProps = {
  arrowOffset: 0,
  contrastMode: false,
  graphEdgeRef: undefined,
  highlighted: false,
  isAnimated: false,
  isDotted: false,
  onMouseEnter: noop,
  onMouseLeave: noop,
  thickness: 1,
  waypointsCap: 10,
  withArrow: false,
};

export default GraphEdge;
