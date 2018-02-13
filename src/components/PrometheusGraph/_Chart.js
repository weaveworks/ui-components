import React from 'react';
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
  strokeWidth: 2,
  fill: 'none',
})`
  opacity: ${props => (props.faded ? 0.1 : 1)};
  pointer-events: none;
`;

const SeriesAreaChart = styled.path.attrs({
  // Use strokeWidth only on focused area graphs to make sure ultra-thin ones
  // still get visible, but don't use it when multiple series are visible so
  // that it doesn't look like it's other series' border.
  strokeWidth: ({ focused }) => (focused ? 1 : 0),
  stroke: ({ fill }) => fill,
})`
  opacity: ${props => (props.faded ? 0.05 : 0.75)};
  pointer-events: none;
`;

class Chart extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.handleResize = debounce(this.handleResize, 200);
  }

  handleResize = () => {
    this.forceUpdate();
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentDidUpdate() {
    const { width, height } = this.getSvgBoundingRect();
    this.props.onChartResize({ chartWidth: width, chartHeight: height });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleGraphMouseMove = (ev) => {
    const { timeScale, valueScale, timestampQuantizer } = this.props;
    const { left, top } = this.getSvgBoundingRect();
    const cursorXOffset = ev.clientX - left;
    const cursorYOffset = ev.clientY - top;

    const cursorValue = valueScale.invert(cursorYOffset);
    const cursorTimestampSec = timeScale.invert(cursorXOffset);
    const hoverTimestampSec = timestampQuantizer(cursorTimestampSec);

    // Build an array of hover points by evaluating the multiseries at the cursor x-coord.
    let hoverPoints = this.props.multiSeries.map((series) => {
      const datapoint = getDatapointAtTimestamp(series, hoverTimestampSec);
      const graphValue = this.getDatapointGraphValue(datapoint);
      return {
        graphValue,
        value: datapoint.value,
        key: series.key,
        name: series.name,
        color: series.color,
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
      hoverY: cursorYOffset,
      hoverX: timeScale(hoverTimestampSec),
      hoverTimestampSec,
      hoverPoints,
    });
  }

  handleGraphMouseLeave = () => {
    this.props.onHoverUpdate({
      hoverTimestampSec: null,
      hoverPoints: null,
      hoverX: null,
      hoverY: null,
    });
  }

  saveSvgRef = (ref) => {
    this.svgRef = ref;
  }

  getSvgBoundingRect() {
    return this.svgRef
      ? this.svgRef.getBoundingClientRect()
      : { width: 0, height: 0, top: 0, left: 0 };
  }

  isFadedSeries(series) {
    const { hoveredLegendSeriesKey, selectedLegendSeriesKey } = this.props;
    // Show series as faded if no series is selected and some other series is hovered.
    return (
      !selectedLegendSeriesKey &&
      hoveredLegendSeriesKey &&
      hoveredLegendSeriesKey !== series.key
    );
  }

  isFocusedSeries(series) {
    const { hoveredLegendSeriesKey, selectedLegendSeriesKey } = this.props;
    // Show series as faded if no series is selected and some other series is hovered.
    return (
      hoveredLegendSeriesKey === series.key ||
      selectedLegendSeriesKey === series.key
    );
  }

  getDatapointGraphValue(datapoint) {
    if (!this.props.showStacked) {
      return datapoint.value;
    }
    return this.getDatapointOffset(datapoint) + datapoint.value;
  }

  getDatapointOffset(datapoint) {
    return this.props.selectedLegendSeriesKey ? 0 : datapoint.offset;
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
      .y0(d => valueScale(this.getDatapointOffset(d)))
      .y1(d => valueScale(this.getDatapointGraphValue(d)));

    return (
      <Canvas
        width="100%" height="100%"
        innerRef={this.saveSvgRef}
        onMouseMove={this.handleGraphMouseMove}
        onMouseLeave={this.handleGraphMouseLeave}
      >
        {multiSeries.map(
          series => (
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
        ))}
      </Canvas>
    );
  }
}

export default Chart;
