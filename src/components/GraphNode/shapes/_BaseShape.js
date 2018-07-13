import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, isNumber } from 'lodash';

import HighlightBorder from './elements/_HighlightBorder';
import HighlightShadow from './elements/_HighlightShadow';
import NodeBackground from './elements/_NodeBackground';
import NodeMetricFill from './elements/_NodeMetricFill';
import NodeShadow from './elements/_NodeShadow';
import NodeBorder from './elements/_NodeBorder';

// Cleans up a value to be used as an element ID.
// Encodes invalid characters to be valid in XHTML and makes it
// so that it can be reversed by decodeIdAttribute.
function encodeIdAttribute(id) {
  return id.replace(/[<>&;]/gm, m => `__u${m.charCodeAt(0)}__`);
}

function getClipPathDefinition(clipId, height, radius) {
  const barHeight = 1 - (2 * height); // in the interval [-1, 1]
  return (
    <defs>
      <clipPath id={clipId} transform={`scale(${2 * radius})`}>
        <rect width={2} height={2} x={-1} y={barHeight} />
      </clipPath>
    </defs>
  );
}

const NodeAnchor = styled.circle.attrs({
  strokeWidth: 0.005,
  r: 0.1,
})`
  fill: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple800};
  stroke: ${props => props.theme.colors.white};
`;

const MetricText = styled.text.attrs({
  transform: 'scale(0.015)',
  dominantBaseline: 'middle',
  textAnchor: 'middle',
})`
  fill: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple800};
`;

class BaseShape extends React.Component {
  render() {
    const {
      renderTemplate,
      id,
      highlighted,
      color,
      metricColor,
      metricFormattedValue,
      metricNumericValue,
      contrastMode,
      size,
    } = this.props;

    const clipId = encodeIdAttribute(`metric-clip-${id}`);
    const hasMetric =
      !isEmpty(metricFormattedValue) && isNumber(metricNumericValue);

    return (
      <g transform={`scale(${size})`}>
        {highlighted && HighlightBorder(renderTemplate, contrastMode)}
        {highlighted && HighlightShadow(renderTemplate, contrastMode)}

        {NodeBackground(renderTemplate, contrastMode)}

        {hasMetric && getClipPathDefinition(clipId, metricNumericValue, 0.48)}
        {hasMetric && NodeMetricFill(renderTemplate, { clipId, metricColor })}

        {NodeShadow(renderTemplate, contrastMode)}
        {NodeBorder(renderTemplate, contrastMode, { hasMetric, color })}

        {hasMetric && highlighted ? (
          <MetricText contrastMode={contrastMode}>
            {metricFormattedValue}
          </MetricText>
        ) : (
          <NodeAnchor contrastMode={contrastMode} />
        )}
      </g>
    );
  }
}

BaseShape.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  renderTemplate: PropTypes.func.isRequired,
  highlighted: PropTypes.bool.isRequired,
  metricColor: PropTypes.string.isRequired,
  metricFormattedValue: PropTypes.string.isRequired,
  metricNumericValue: PropTypes.number,
};

export default BaseShape;
