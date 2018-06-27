import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { line, curveCardinalClosed } from 'd3-shape';
import { range } from 'lodash';

import theme from '../../../theme';

const getMetricValue = () => ({ hasMetric: false });
const getMetricColor = () => '#000';
const encodeIdAttribute = s => s;
const getClipPathDefinition = () => null;

const STROKE_WIDTH = 0.1;

export function curvedUnitPolygonPath(n) {
  const curve = curveCardinalClosed.tension(0.65);
  const spline = line().curve(curve);
  const innerAngle = (2 * Math.PI) / n;
  return spline(range(0, n).map(k => [
    Math.sin(k * innerAngle),
    -Math.cos(k * innerAngle),
  ]));
}

class Shape extends React.Component {
  render() {
    const { type, renderTemplate, id, highlighted, color, metric, size } = this.props;
    const { height, hasMetric, formattedValue } = getMetricValue(metric);
    const className = classNames('shape', `shape-${type}`, { metrics: hasMetric });
    const metricStyle = { fill: getMetricColor(metric) };
    const clipId = encodeIdAttribute(`metric-clip-${id}`);

    return (
      <g className={className} transform={`scale(${size})`}>
        {highlighted && renderTemplate({
          className: 'highlight-border',
          transform: `scale(${0.5})`,
          style: {
            fill: 'none',
            stroke: theme.colors.blue400,
            strokeWidth: 0.7 + (STROKE_WIDTH * 2),
            strokeOpacity: 0.5,
          }
        })}
        {highlighted && renderTemplate({
          className: 'highlight-shadow',
          transform: `scale(${0.5})`,
          style: {
            fill: 'none',
            stroke: theme.colors.white,
            strokeWidth: 0.7,
            strokeOpacity: 0.5,
          }
        })}
        {renderTemplate({
          className: 'background',
          transform: `scale(${0.48})`,
          style: {
            stroke: 'none',
            fill: 'white',
          },
        })}
        {hasMetric && getClipPathDefinition(clipId, height, 0.48)}
        {hasMetric && renderTemplate({
          className: 'metric-fill',
          transform: `scale(${0.48})`,
          clipPath: `url(#${clipId})`,
          style: metricStyle,
        })}
        {renderTemplate({
          className: 'shadow',
          transform: `scale(${0.49})`,
          style: {
            fill: 'none',
            stroke: theme.colors.white,
            strokeWidth: STROKE_WIDTH,
          },
        })}
        {renderTemplate({
          className: 'border',
          transform: `scale(${0.5})`,
          style: {
            fill: 'none',
            strokeOpacity: 1,
            strokeWidth: STROKE_WIDTH,
          },
          stroke: color,
        })}
        {hasMetric && highlighted ?
          <text>{formattedValue}</text> :
          <circle className="node" r={0.1} />
        }
      </g>
    );
  }
}

Shape.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  renderTemplate: PropTypes.func.isRequired,
  highlighted: PropTypes.bool,
  metric: PropTypes.number,
};

Shape.defaultProps = {
  highlighted: true,
  metric: null,
};

export default Shape;
