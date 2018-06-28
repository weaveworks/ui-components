import React from 'react';
import PropTypes from 'prop-types';

import HighlightBorder from './elements/_HighlightBorder';
import HighlightShadow from './elements/_HighlightShadow';
import NodeBackground from './elements/_NodeBackground';
import NodeMetricFill from './elements/_NodeMetricFill';
import NodeShadow from './elements/_NodeShadow';
import NodeBorder from './elements/_NodeBorder';

const getMetricValue = () => ({ hasMetric: false });
const encodeIdAttribute = s => s;
const getClipPathDefinition = () => null;

class BaseShape extends React.Component {
  render() {
    const { renderTemplate, id, highlighted, color, metric, size } = this.props;
    const { height, hasMetric, formattedValue } = getMetricValue(metric);
    const clipId = encodeIdAttribute(`metric-clip-${id}`);

    return (
      <g transform={`scale(${size})`}>
        {highlighted && HighlightBorder(renderTemplate)}
        {highlighted && HighlightShadow(renderTemplate)}

        {NodeBackground(renderTemplate)}

        {hasMetric && getClipPathDefinition(clipId, height, 0.48)}
        {hasMetric && NodeMetricFill(renderTemplate, { clipId, metric })}

        {NodeShadow(renderTemplate)}
        {NodeBorder(renderTemplate, { color })}

        {hasMetric && highlighted ?
          <text>{formattedValue}</text> :
          <circle r={0.1} />
        }
      </g>
    );
  }
}

BaseShape.propTypes = {
  id: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  renderTemplate: PropTypes.func.isRequired,
  highlighted: PropTypes.bool,
  metric: PropTypes.number,
};

BaseShape.defaultProps = {
  highlighted: false,
  metric: null,
};

export default BaseShape;
