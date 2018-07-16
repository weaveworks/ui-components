import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { noop } from 'lodash';

import { encodeIdAttribute } from '../../utils/dom';

const EdgeArrowMarker = styled.marker`
  color: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple500};
  fill: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple500};
`;

const EdgeArrowDefinition = ({ id, zoomed, contrastMode }) => {
  const markerOffset = zoomed ? '35' : '40';
  const markerSize = zoomed ? '10' : '30';
  return (
    <defs>
      <EdgeArrowMarker
        id={id}
        contrastMode={contrastMode}
        viewBox="1 0 10 10"
        refX={markerOffset}
        refY="3.5"
        markerWidth={markerSize}
        markerHeight={markerSize}
        orient="auto"
      >
        <polygon className="link" points="0 0, 10 3.5, 0 7" />
      </EdgeArrowMarker>
    </defs>
  );
};

const EdgeShadow = styled.path`
  stroke: ${props => props.theme.colors.blue400};
  stroke-width: ${props => 10 * props.thickness};
  stroke-opacity: ${props => (props.contrastMode ? 0.3 : 0.1)};
  fill: none;
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

/**
 * A component for rendering labeled graph nodes.
 */
class GraphEdge extends React.Component {
  render() {
    const {
      id,
      path,
      thickness,
      showArrow,
      showDashed,
      highlighted,
      contrastMode,
    } = this.props;

    const encodedId = encodeIdAttribute(id);
    const encodedArrowId = `end-arrow-${encodedId}`;

    return (
      <g
        id={encodedId}
        onMouseEnter={ev => this.props.onMouseEnter(id, ev)}
        onMouseLeave={ev => this.props.onMouseLeave(id, ev)}
      >
        {showArrow && (
          <EdgeArrowDefinition id={encodedArrowId} zoomed={false} />
        )}
        {highlighted && (
          <EdgeShadow
            d={path}
            thickness={thickness}
            contrastMode={contrastMode}
          />
        )}
        {showDashed && <EdgeDashed d={path} contrastMode={contrastMode} />}
        <EdgeLine
          d={path}
          thickness={thickness}
          contrastMode={contrastMode}
          markerEnd={showArrow ? `url(#${encodedArrowId})` : null}
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
  thickness: PropTypes.number,
  highlighted: PropTypes.bool,
  showArrow: PropTypes.bool,
  showDashed: PropTypes.bool,
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
  showArrow: false,
  showDashed: false,
  isAnimated: true,
  contrastMode: false,
  onMouseEnter: noop,
  onMouseLeave: noop,
};

export default GraphEdge;
