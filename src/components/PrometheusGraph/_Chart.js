import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { debounce, sortedIndex, minBy } from 'lodash';
import { line, area } from 'd3-shape';

function getDatapointAtTimestamp(series, timestampSec) {
  const timestamps = series.datapoints.map(d => d.timestampSec);
  const index = sortedIndex(timestamps, timestampSec);
  return series.datapoints[index];
}

const Canvas = styled.svg`
  cursor: crosshair;
  position: absolute;
`;

const SeriesLineChart = styled.path.attrs({
  fill: 'none',
  strokeWidth: 2,
})`
  opacity: ${props => (props.faded ? 0.1 : 1)};
  pointer-events: none;
`;

const SeriesAreaChart = styled.path.attrs({
  stroke: ({ fill }) => fill,
  // Use strokeWidth only on focused area graphs to make sure ultra-thin ones
  // still get visible, but don't use it when multiple series are visible so
  // that it doesn't look like it's other series' border.
  strokeWidth: ({ focused }) => (focused ? 1 : 0),
})`
  opacity: ${props => (props.faded ? 0.05 : 0.75)};
  pointer-events: none;
`;

class Chart extends React.PureComponent {
  handleResize = debounce(() => {
    const { width, height } = this.getSvgBoundingRect();
    this.props.onChartResize({ chartHeight: height, chartWidth: width });
  }, 50);

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleGraphMouseMove = ev => {
    const { timeScale, valueScale, timestampQuantizer } = this.props;
    const { left, top } = this.getSvgBoundingRect();
    const cursorXOffset = ev.clientX - left;
    const cursorYOffset = ev.clientY - top;

    const cursorValue = valueScale.invert(cursorYOffset);
    const cursorTimestampSec = timeScale.invert(cursorXOffset);
    const hoverTimestampSec = timestampQuantizer(cursorTimestampSec);

    // Build an array of hover points by evaluating the multiseries at the cursor x-coord.
    let hoverPoints = this.props.multiSeries.map(series => {
      const datapoint = getDatapointAtTimestamp(series, hoverTimestampSec);
      return {
        color: series.color,
        graphValue: datapoint.offset + datapoint.value,
        hoverName: series.hoverName,
        key: series.key,
        value: datapoint.value,
      };
    });

    let focusedSeries = {};
    if (this.props.showStacked) {
      // If the graph is stacked, focus the closest series above the,
      // cursor, as that one's area is hovered by the mouse cursor.
      const isSeriesAbove = s => s.graphValue >= cursorValue;
      const hoverPointsAboveCursor = hoverPoints.filter(isSeriesAbove);
      focusedSeries = minBy(hoverPointsAboveCursor, 'graphValue') || {};
    } else {
      // Otherwise, in a line graph focus the series with the nearest value.
      const distanceFromCursor = s => Math.abs(s.graphValue - cursorValue);
      focusedSeries = minBy(hoverPoints, distanceFromCursor) || {};
    }

    // Update the hover points with focus data.
    hoverPoints = hoverPoints.map(s => ({
      ...s,
      focused: focusedSeries.key === s.key,
    }));

    this.props.onHoverUpdate({
      hoverPoints,
      hoverTimestampSec,
      hoverX: timeScale(hoverTimestampSec),
      hoverY: cursorYOffset,
    });
  };

  handleGraphMouseLeave = () => {
    this.props.onHoverUpdate({
      hoverPoints: null,
      hoverTimestampSec: null,
      hoverX: null,
      hoverY: null,
    });
  };

  saveSvgRef = ref => {
    this.svgRef = ref;
  };

  getSvgBoundingRect() {
    const defaultRect = {
      height: 0,
      left: 0,
      top: 0,
      width: 0,
    };

    return this.svgRef ? this.svgRef.getBoundingClientRect() : defaultRect;
  }

  isFadedSeries(series) {
    const { hoveredLegendKey, selectedLegendKeys } = this.props;
    // Show series as faded if no series is selected and some other series is hovered.
    return (
      selectedLegendKeys.length === 0 &&
      hoveredLegendKey &&
      hoveredLegendKey !== series.key
    );
  }

  isFocusedSeries(series) {
    const { hoveredLegendKey, selectedLegendKeys } = this.props;
    // Show series as focused if it's selected or hovered.
    return (
      hoveredLegendKey === series.key || selectedLegendKeys.includes(series.key)
    );
  }

  render() {
    const { multiSeries, timeScale, valueScale } = this.props;

    const lineFunction = line()
      .defined(d => d.value !== null)
      .x(d => timeScale(d.timestampSec))
      .y(d => valueScale(d.value));
    const areaFunction = area()
      .defined(d => d.value !== null)
      .x(d => timeScale(d.timestampSec))
      .y1(d => valueScale(d.offset + d.value))
      .y0(d => valueScale(d.offset));

    return (
      <Canvas
        width="100%"
        height="100%"
        innerRef={this.saveSvgRef}
        onMouseMove={this.handleGraphMouseMove}
        onMouseLeave={this.handleGraphMouseLeave}
      >
        {multiSeries.map(series =>
          this.props.showStacked ? (
            <SeriesAreaChart
              key={series.key}
              faded={this.isFadedSeries(series)}
              focused={this.isFocusedSeries(series)}
              d={areaFunction(series.datapoints)}
              fill={series.color}
            />
          ) : (
            <SeriesLineChart
              key={series.key}
              faded={this.isFadedSeries(series)}
              d={lineFunction(series.datapoints)}
              stroke={series.color}
            />
          )
        )}
      </Canvas>
    );
  }
}

Chart.propTypes = {
  hoveredLegendKey: PropTypes.string,
  multiSeries: PropTypes.array.isRequired,
  onChartResize: PropTypes.func.isRequired,
  onHoverUpdate: PropTypes.func.isRequired,
  selectedLegendKeys: PropTypes.array.isRequired,
  showStacked: PropTypes.bool.isRequired,
  timeScale: PropTypes.func.isRequired,
  timestampQuantizer: PropTypes.func.isRequired,
  valueScale: PropTypes.func.isRequired,
};

Chart.defaultProps = {
  hoveredLegendKey: '',
};

export default Chart;
