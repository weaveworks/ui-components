import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { line, curveBasis } from 'd3-shape';
import { noop } from 'lodash';

import { encodeIdAttribute } from '../../utils/dom';

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

const EdgeDashed = styled.path`
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

/**
 * A component for rendering labeled graph nodes.
 */
class GraphEdge extends React.Component {
  render() {
    const {
      id,
      waypoints,
      thickness,
      withArrow,
      arrowOffset,
      isDashed,
      highlighted,
      contrastMode,
    } = this.props;

    const encodedId = encodeIdAttribute(id);
    const encodedArrowId = `end-arrow-${encodedId}`;
    const arrowThickness = Math.sqrt(thickness);
    const path = spline(waypoints);

    return (
      <g
        id={encodedId}
        onMouseEnter={ev => this.props.onMouseEnter(id, ev)}
        onMouseLeave={ev => this.props.onMouseLeave(id, ev)}
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
        {isDashed && <EdgeDashed d={path} contrastMode={contrastMode} />}
        <EdgeLine
          d={path}
          thickness={thickness}
          contrastMode={contrastMode}
          markerEnd={withArrow ? `url(#${encodedArrowId})` : null}
        />
      </g>
    );
  }
}

GraphEdge.propTypes = {
  /**
   * A unique node ID
   */
  id: PropTypes.string.isRequired,
  waypoints: PropTypes.array.isRequired,
  thickness: PropTypes.number,
  highlighted: PropTypes.bool,
  withArrow: PropTypes.bool,
  arrowOffset: PropTypes.number,
  isDashed: PropTypes.bool,
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
  thickness: 1,
  highlighted: false,
  withArrow: false,
  arrowOffset: 28,
  isDashed: false,
  isAnimated: true,
  contrastMode: false,
  onMouseEnter: noop,
  onMouseLeave: noop,
};

export default GraphEdge;
