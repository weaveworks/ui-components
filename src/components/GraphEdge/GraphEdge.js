import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { line, curveBasis } from 'd3-shape';
import { filter, isEmpty, times, noop, each } from 'lodash';
import { spring, Motion } from 'react-motion';

import { encodeIdAttribute } from '../../utils/dom';

function weakSpring(value) {
  return spring(value, { stiffness: 100, damping: 18, precision: 1 });
}

const spline = line()
  .curve(curveBasis)
  .x(d => d.x)
  .y(d => d.y);

const EdgeShadow = styled.path`
  stroke: ${props => props.theme.colors.blue400};
  stroke-width: ${props => 10 * props.thickness};
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

const EdgeLine = styled.path`
  stroke: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple500};
  stroke-width: ${props => props.thickness};
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
const waypointsMapToArray = waypointsMap => {
  const waypointsArray = times(10, () => ({}));
  each(waypointsMap, (value, key) => {
    const [axis, index] = [key[0], key.slice(1)];
    waypointsArray[index][axis] = value;
  });
  return filter(waypointsArray, e => !isEmpty(e));
};

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
class GraphEdge extends React.Component {
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
    const waypointsMissing = waypointsCap - waypoints.size;
    if (waypointsMissing > 0) {
      waypoints = times(waypointsMissing, () => waypoints[0]).concat(waypoints);
    }

    this.setState({ waypointsMap: waypointsArrayToMap(waypoints) });
  }

  renderEdge(props) {
    const {
      id,
      waypoints,
      thickness,
      withArrow,
      arrowOffset,
      isDotted,
      highlighted,
      contrastMode,
    } = props;

    const encodedId = encodeIdAttribute(id);
    const encodedArrowId = `end-arrow-${encodedId}`;
    const arrowThickness = Math.sqrt(thickness);
    const path = spline(waypoints);

    return (
      <g
        id={encodedId}
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
    if (!this.props.isAnimated) {
      return this.renderEdge(this.props);
    }

    return (
      // For the Motion interpolation to work, the waypoints need to be in a map format like
      // { x0: 11, y0: 22, x1: 33, y1: 44 } that we convert to the array format when rendering.
      <Motion
        style={{
          interpolatedThickness: weakSpring(this.props.thickness),
          ...this.state.waypointsMap,
        }}
      >
        {({ interpolatedThickness, ...interpolatedWaypoints }) =>
          this.renderEdge({
            ...this.props,
            waypoints: waypointsMapToArray(interpolatedWaypoints),
            thickness: interpolatedThickness,
          })
        }
      </Motion>
    );
  }
}

GraphEdge.propTypes = {
  /**
   * A unique edge ID
   */
  id: PropTypes.string.isRequired,
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
   * Thickness of the rendered edge line
   */
  thickness: PropTypes.number,
  /**
   * Shows the blue shadow around the edge if true
   */
  highlighted: PropTypes.bool,
  /**
   * Draws a one-way arrow on the edge if true
   */
  withArrow: PropTypes.bool,
  /**
   * Distance from the target point (tweak this to pull the arrow out of the rendered node)
   */
  arrowOffset: PropTypes.number,
  /**
   * Shows extra dots on the edge path if true
   */
  isDotted: PropTypes.bool,
  /**
   * Animates the edge motion if true
   */
  isAnimated: PropTypes.bool,
  /**
   * Renders the edge in a high contrast mode
   */
  contrastMode: PropTypes.bool,
  /**
   * Callback for mouse pointer entering the edge
   */
  onMouseEnter: PropTypes.func,
  /**
   * Callback for mouse pointer leaving the edge
   */
  onMouseLeave: PropTypes.func,
};

GraphEdge.defaultProps = {
  waypointsCap: 10,
  thickness: 1,
  highlighted: false,
  withArrow: false,
  arrowOffset: 0,
  isDotted: false,
  isAnimated: false,
  contrastMode: false,
  onMouseEnter: noop,
  onMouseLeave: noop,
};

export default GraphEdge;
