import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {
  debounce,
  min,
  max,
  flatten,
  sortedIndex,
  range,
  values,
  sortBy,
  first,
  last,
  minBy,
  map,
} from 'lodash';
import { scaleLinear, scaleQuantize } from 'd3-scale';
import { line, stack, area } from 'd3-shape';

import { timeUnits, numericUnits } from './units';
import { largePalette } from './color-palettes';
import GraphLegend from './_GraphLegend';

const PADDING = 5;

function parseGraphValue(value) {
  const val = parseFloat(value);
  if (Number.isNaN(val)) {
    // "+Inf", "-Inf", "+Inf" will be parsed into NaN by parseFloat(). The
    // can't be graphed, so show them as gaps (null).
    return null;
  }
  return val;
}

function getDatapointAtTimestamp(series, timestampSec) {
  const timestamps = series.datapoints.map(d => d.timestampSec);
  const index = sortedIndex(timestamps, timestampSec);
  return series.datapoints[index];
}

const GraphContainer = styled.div`
  position: relative;
`;

const Graph = styled.div`
  position: relative;
  min-height: 170px;
`;

const Canvas = styled.svg`
  cursor: crosshair;
`;

const ColorBox = styled.span`
  background-color: ${props => props.color};
  border-radius: 1px;
  margin-right: 4px;
  min-width: 10px;
  height: 4px;
`;

const AxisLabel = styled.span`
  color: ${props => props.theme.colors.neutral.black};
  font-size: ${props => props.theme.fontSizes.normal};
  transform: translate(-60px, 165px) rotate(-90deg);
  transform-origin: left top 0;
  display: inline-block;
`;

const AxisTicksContainer = styled.div`
  position: absolute;
  left: 0;
`;

const YAxisTicksContainer = AxisTicksContainer.extend`
  top: 0;
`;

const XAxisTicksContainer = AxisTicksContainer.extend`
  bottom: 0;
`;

const AxisLine = styled.line.attrs({
  stroke: '#ccc',
  strokeDasharray: [1, 2],
  strokeWidth: 1,
})``;

const TickLabel = styled.span`
  color: #555;
  display: block;
  font-size: 12px;
  position: absolute;
  white-space: nowrap;
`;

const YAxisTickLabel = TickLabel.extend.attrs({
  style: ({ offset }) => ({ top: offset - 8 }),
})`
  right: 5px;
`;

const XAxisTickLabel = TickLabel.extend.attrs({
  style: ({ offset }) => ({ left: offset }),
})`
  top: -18px;
`;

const SeriesLineChart = styled.path.attrs({
  strokeWidth: 2,
  fill: 'none',
})`
  opacity: ${props => (props.faded ? 0.1 : 1)};
`;

const SeriesAreaChart = styled.path.attrs({
  // Use strokeWidth only on focused area graphs to make sure ultra-thin ones
  // still get visible, but don't use it when multiple series are visible so
  // that it doesn't look like it's other series' border.
  strokeWidth: ({ focused }) => (focused ? 1 : 0),
  stroke: ({ fill }) => fill,
})`
  opacity: ${props => (props.faded ? 0.05 : 0.75)};
`;

const VerticalLine = styled.line.attrs({
  y1: props => props.height - PADDING,
  y2: PADDING,
})``;

const HoverLine = VerticalLine.extend.attrs({
  stroke: '#aaa',
  strokeWidth: 1,
})`
  pointer-events: none;
`;

const HoverCircle = styled.circle.attrs({
  opacity: ({ focused }) => (focused ? 1 : 0.5),
  r: ({ focused }) => (focused ? 4 : 3),
  strokeWidth: 3,
  fill: '#fff',
})`
  pointer-events: none;
`;

const DeploymentAnnotationShadow = VerticalLine.extend.attrs({
  stroke: '#fff',
  strokeWidth: 2,
  opacity: 0.2,
})``;

const DeploymentAnnotationLine = VerticalLine.extend.attrs({
  stroke: '#00d2ff',
  strokeWidth: 0.5,
})``;

const DeploymentAnnotationPoint = styled.circle.attrs({
  r: 3.5,
  strokeWidth: 2.5,
  stroke: '#00d2ff',
  fill: '#fff',
})`
  cursor: default;
`;

const DeploymentInfo = styled.div``;

const DeploymentInfoLine = styled.span`
  margin-top: 1px;
  display: block;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TooltipContainer = styled.div.attrs({
  // Using attrs prevents extensive styled components
  // generation every time the tooltip is repositioned.
  style: ({ x, y }) => ({ left: x, top: y }),
})`
  background-color: ${props => props.theme.colors.lightgray};
  border: 1px solid ${props => props.theme.colors.neutral.lightgray};
  border-radius: 4px;
  padding: 10px 15px;
  color: #555;
  position: absolute;
  margin-top: 35px;
  margin-left: 10px;
  pointer-events: none;
  min-width: 250px;
  max-width: 500px;
  opacity: 0.95;
  z-index: 5;
`;

const TooltipTimestamp = styled.div`
  font-size: 13px;
  margin-bottom: 5px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;

  ${props =>
    props.focused &&
    `
    font-weight: bold;
    font-size: 13px;
  `};
`;

const TooltipRowName = styled.span`
  flex-grow: 1;
  white-space: pre;
  display: block;
  align-items: center;
  margin-right: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TooltipValue = styled.span`
  font-family: 'Roboto', sans-serif;
  margin-left: 20px;
  white-space: nowrap;
`;

class DashboardGraph extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedLegendSeriesKey: null,
      hoveredLegendSeriesKey: null,
      hoveredDeployment: null,
      hoverTimestampSec: null,
      hoverYOffset: null,
      hoverXOffset: null,
      hoverPoints: null,
      multiSeries: [],
    };

    this.saveSvgRef = this.saveSvgRef.bind(this);
    this.saveTooltipRef = this.saveTooltipRef.bind(this);
    this.processMultiSeries = this.processMultiSeries.bind(this);
    this.handleResize = debounce(this.handleResize.bind(this), 200);

    this.handleGraphMouseMove = this.handleGraphMouseMove.bind(this);
    this.handleGraphMouseLeave = this.handleGraphMouseLeave.bind(this);

    this.handleSelectedLegendSeriesChange = this.handleSelectedLegendSeriesChange.bind(this);
    this.handleHoveredLegendSeriesChange = this.handleHoveredLegendSeriesChange.bind(this);
  }

  handleResize() {
    this.forceUpdate();
  }

  componentWillMount() {
    this.processMultiSeries(this.props);
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.multiSeries !== nextProps.multiSeries) {
      this.processMultiSeries(nextProps);
    }
  }

  handleSelectedLegendSeriesChange(selectedLegendSeriesKey) {
    this.setState({ selectedLegendSeriesKey });
  }

  handleHoveredLegendSeriesChange(hoveredLegendSeriesKey) {
    this.setState({ hoveredLegendSeriesKey });
  }

  handleDeploymentMouseEnter(deployment) {
    this.setState({ hoveredDeployment: deployment });
  }

  handleDeploymentMouseLeave() {
    this.setState({ hoveredDeployment: null });
  }

  handleGraphMouseMove(ev) {
    const { left, top } = this.getSvgBoundingRect();
    const timestampQuantizer = this.getTimestampQuantizer();
    const valueScale = this.getValueScale();
    const timeScale = this.getTimeScale();
    const cursorXOffset = ev.clientX - left;
    const cursorYOffset = ev.clientY - top;

    const cursorValue = valueScale.invert(cursorYOffset);
    const cursorTimestampSec = timeScale.invert(cursorXOffset);
    const hoverTimestampSec = timestampQuantizer(cursorTimestampSec);

    // Build an array of hover points by evaluating the multiseries at the cursor x-coord.
    let hoverPoints = this.getVisibleMultiSeries().map((series) => {
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

    // Simple tooltip will only show the value for the hovered series.
    if (this.props.simpleTooltip) {
      hoverPoints = hoverPoints.filter(p => p.focused);
    }

    this.setState({
      hoverYOffset: cursorYOffset,
      hoverXOffset: timeScale(hoverTimestampSec),
      hoverTimestampSec,
      hoverPoints,
    });
  }

  handleGraphMouseLeave() {
    this.setState({
      hoverYOffset: null,
      hoverXOffset: null,
      hoverTimestampSec: null,
      hoverPoints: null,
    });
  }

  saveSvgRef(ref) {
    this.svgRef = ref;
  }

  saveTooltipRef(ref) {
    this.tooltipRef = ref;
  }

  getSvgBoundingRect() {
    return this.svgRef
      ? this.svgRef.getBoundingClientRect()
      : { width: 0, height: 0, top: 0, left: 0 };
  }

  getTooltipBoundingRect() {
    return this.tooltipRef
      ? this.tooltipRef.getBoundingClientRect()
      : { width: 0, height: 0, top: 0, left: 0 };
  }

  processMultiSeries(props) {
    // Get the sorted list of names for all the series.
    const multiSeriesNames = props.multiSeries
      .map(series => props.getLabel(series))
      .sort();

    // This D3 scale takes care of rounding all the datapoints to the nearest discrete timestamp.
    const timestampQuantizer = this.getTimestampQuantizer(props);
    const timestampSecs = timestampQuantizer.range();

    // Initialize all the graph values to null, as if the graph was empty.
    const valuesByTimestamp = {};
    timestampSecs.forEach((timestampSec) => {
      valuesByTimestamp[timestampSec] = { timestampSec };
      multiSeriesNames.forEach((seriesName) => {
        valuesByTimestamp[timestampSec][seriesName] = null;
      });
    });

    // Go through the datapoints of all the series and fill in
    // their values (in a format that works for D3 stack helpers).
    props.multiSeries.forEach((series, seriesIndex) => {
      series.values.forEach((point) => {
        const value = parseGraphValue(point[1]);
        const timestampSec = timestampQuantizer(point[0]);
        const seriesName = multiSeriesNames[seriesIndex];
        valuesByTimestamp[timestampSec][seriesName] = value;
      });
    });

    // Stack the graph series in the alphabetical order.
    const valuesForStacking = sortBy(values(valuesByTimestamp), [
      'timestampSec',
    ]);
    const stackFunction = stack().keys(multiSeriesNames);
    const stackedData = stackFunction(valuesForStacking);

    // Finally store the multi-series ready to be graphed.
    const multiSeries = multiSeriesNames.map((seriesName, seriesIndex) => ({
      name: seriesName,
      key: `${seriesName}:${seriesIndex}`,
      color: props.colorScheme(seriesIndex),
      datapoints: timestampSecs.map((timestampSec, timestampIndex) => ({
        timestampSec,
        value: valuesByTimestamp[timestampSec][seriesName],
        offset: stackedData[seriesIndex][timestampIndex][0],
      })),
    }));

    this.setState({ multiSeries });
  }

  yAxisSpread() {
    const yPositions = flatten(
      this.getVisibleMultiSeries().map(series =>
        series.datapoints.map(datapoint =>
          this.getDatapointGraphValue(datapoint)
        )
      )
    );
    return {
      minY: Math.min(this.props.baseMinValue, min(yPositions)),
      maxY: Math.max(this.props.baseMaxValue, max(yPositions)),
    };
  }

  isFadedSeries(series) {
    const { hoveredLegendSeriesKey, selectedLegendSeriesKey } = this.state;
    // Show series as faded if no series is selected and some other series is hovered.
    return (
      !selectedLegendSeriesKey &&
      hoveredLegendSeriesKey &&
      hoveredLegendSeriesKey !== series.key
    );
  }

  isFocusedSeries(series) {
    const { hoveredLegendSeriesKey, selectedLegendSeriesKey } = this.state;
    // Show series as faded if no series is selected and some other series is hovered.
    return (
      hoveredLegendSeriesKey === series.key ||
      selectedLegendSeriesKey === series.key
    );
  }

  getTimestampQuantizer(props = this.props) {
    const { startTime, endTime, stepDuration } = props;
    // Timestamp values are stepDuration seconds apart and they always end at
    // endTime. We make startTime a bit smaller to include it in the range in case
    // (endTime - startTime) is divisible by stepDuration.
    const timestampSecs = range(
      endTime,
      startTime - 1e-6,
      -stepDuration
    ).sort();
    // scaleQuantize would normally map domain in buckets of uniform lengths. To
    // make it map to the nearest point in timestampSecs instead, we need to extend
    // the domain by half of stepDuration at each end.
    const startDomain = first(timestampSecs) - (0.5 * stepDuration);
    const endDomain = last(timestampSecs) + (0.5 * stepDuration);
    return scaleQuantize()
      .domain([startDomain, endDomain])
      .range(timestampSecs);
  }

  getTimeScale() {
    const { width } = this.getSvgBoundingRect();
    const { startTime, endTime } = this.props;
    return scaleLinear()
      .domain([startTime, endTime])
      .range([PADDING, width - PADDING]);
  }

  getValueScale() {
    const { height } = this.getSvgBoundingRect();
    const { minY, maxY } = this.yAxisSpread();
    return scaleLinear()
      .domain([minY, maxY])
      .range([height - PADDING, PADDING]);
  }

  getDatapointGraphValue(datapoint) {
    if (!this.props.showStacked) {
      return datapoint.value;
    }
    return this.getDatapointOffset(datapoint) + datapoint.value;
  }

  getDatapointOffset(datapoint) {
    return this.state.selectedLegendSeriesKey ? 0 : datapoint.offset;
  }

  getVisibleMultiSeries() {
    // If no series is selected, show all of them.
    if (!this.state.selectedLegendSeriesKey) {
      return this.state.multiSeries;
    }
    // Otherwise show only the selected series.
    return this.state.multiSeries.filter(
      series => this.state.selectedLegendSeriesKey === series.key
    );
  }

  renderDeploymentInfo() {
    const { hoveredDeployment } = this.state;
    if (!hoveredDeployment) return null;

    const [action, ...serviceIDs] = hoveredDeployment.Data.split(', ');

    return (
      <DeploymentInfo>
        <DeploymentInfoLine>
          <strong>{action}</strong>
        </DeploymentInfoLine>
        {serviceIDs.map(serviceId => (
          <DeploymentInfoLine key={serviceId}>
            &rarr; {serviceId}
          </DeploymentInfoLine>
        ))}
      </DeploymentInfo>
    );
  }

  renderHoverBar() {
    const { height } = this.getSvgBoundingRect();
    const { hoverXOffset, hoverPoints } = this.state;
    const valueScale = this.getValueScale();

    if (!hoverPoints) return null;

    // Render focused circle last so that it stands out.
    const sortedHoverPoints = [...hoverPoints].sort(a => (a.focused ? 1 : -1));

    return (
      <g transform={`translate(${hoverXOffset}, 0)`}>
        <HoverLine height={height} />
        {sortedHoverPoints.map(datapoint => (
          <HoverCircle
            key={datapoint.key}
            stroke={datapoint.color}
            focused={datapoint.focused}
            cy={valueScale(datapoint.graphValue)}
          />
        ))}
      </g>
    );
  }

  renderHoverTooltip() {
    const tooltipWidth = this.getTooltipBoundingRect().width;
    const graphWidth = this.getSvgBoundingRect().width;
    const {
      hoverPoints,
      hoverXOffset,
      hoverYOffset,
      hoverTimestampSec,
      hoveredDeployment,
    } = this.state;

    if (!hoverPoints && !hoveredDeployment) return null;

    // TODO: Consider changing the timestamp to a more standard format.
    const humanizedTimestamp = new Date(
      hoveredDeployment ? hoveredDeployment.Stamp : 1000 * hoverTimestampSec
    ).toUTCString();
    const x = Math.min(hoverXOffset, graphWidth - tooltipWidth - 15);

    // We want to have same formatting (precision, units, etc...) across
    // all tooltip values so we create a formatter for a reference value
    // (1 / 100 of the max value) and use it across all datapoints.
    const referenceValue = (max(map(hoverPoints, 'value')) || 0) / 100;
    const formatValue = this.props.yAxisUnits.formatFor(referenceValue);

    return (
      <TooltipContainer x={x} y={hoverYOffset} innerRef={this.saveTooltipRef}>
        <TooltipTimestamp>{humanizedTimestamp}</TooltipTimestamp>
        {hoveredDeployment
          ? this.renderDeploymentInfo()
          : hoverPoints.map(datapoint => (
            <TooltipRow key={datapoint.key} focused={datapoint.focused}>
              <ColorBox small color={datapoint.color} />
              <TooltipRowName>{datapoint.name}</TooltipRowName>
              <TooltipValue>{formatValue(datapoint.value)}</TooltipValue>
            </TooltipRow>
          ))}
      </TooltipContainer>
    );
  }

  render() {
    const { startTime, endTime, yAxisUnits } = this.props;
    const { width, height } = this.getSvgBoundingRect();
    const { minY, maxY } = this.yAxisSpread();

    const timeScale = this.getTimeScale();
    const valueScale = this.getValueScale();
    const lineFunction = line()
      .defined(d => d.value !== null)
      .x(d => timeScale(d.timestampSec))
      .y(d => valueScale(d.value));
    const areaFunction = area()
      .defined(d => d.value !== null)
      .x(d => timeScale(d.timestampSec))
      .y0(d => valueScale(this.getDatapointOffset(d)))
      .y1(d => valueScale(this.getDatapointGraphValue(d)));

    const xAxisTicks = timeUnits.getSpread([startTime, endTime], timeScale);
    const yAxisTicks = yAxisUnits.getSpread([minY, maxY], valueScale);

    return (
      <GraphContainer>
        <AxisLabel>{this.props.yAxisLabel}</AxisLabel>
        <Graph>
          <Canvas
            width="100%"
            height="100%"
            onMouseMove={this.handleGraphMouseMove}
            onMouseLeave={this.handleGraphMouseLeave}
            innerRef={this.saveSvgRef}
          >
            <g className="y-axis-grid">
              {height &&
                yAxisTicks.map(({ offset, value }) => (
                  <AxisLine
                    key={value}
                    x1={PADDING}
                    x2={width - PADDING}
                    y1={offset}
                    y2={offset}
                  />
                ))}
            </g>
            <g className="x-axis-grid">
              {width &&
                xAxisTicks.map(({ offset, value }) => (
                  <AxisLine
                    key={value}
                    y1={PADDING}
                    y2={height - PADDING}
                    x1={offset}
                    x2={offset}
                  />
                ))}
            </g>
            <g className="graph">
              {this.getVisibleMultiSeries().map(
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
            </g>
            <g className="deployments">
              {this.props.deployments.map(d => (
                <g
                  key={d.Data}
                  transform={`translate(${timeScale(moment(d.Stamp).unix())})`}
                >
                  <DeploymentAnnotationShadow height={height} />
                  <DeploymentAnnotationLine height={height} />
                  <DeploymentAnnotationPoint
                    cy={height - PADDING}
                    onMouseMove={() => this.handleDeploymentMouseEnter(d)}
                    onMouseLeave={() => this.handleDeploymentMouseLeave()}
                  />
                </g>
              ))}
            </g>
            {!this.state.hoveredDeployment && this.renderHoverBar()}
          </Canvas>
          <YAxisTicksContainer>
            {height &&
              yAxisTicks.map(({ value, offset }) => (
                <YAxisTickLabel key={value} offset={offset}>
                  {value}
                </YAxisTickLabel>
              ))}
          </YAxisTicksContainer>
          <XAxisTicksContainer>
            {width &&
              xAxisTicks.map(({ value, offset }) => (
                <XAxisTickLabel key={value} offset={offset}>
                  {value}
                </XAxisTickLabel>
              ))}
          </XAxisTicksContainer>
        </Graph>
        {this.state.multiSeries.length > 1 && (
          <GraphLegend
            multiSeries={this.state.multiSeries}
            legendShown={this.props.legendShown}
            legendCollapsable={this.props.legendCollapsable}
            onSelectedLegendSeriesChange={this.handleSelectedLegendSeriesChange}
            onHoveredLegendSeriesChange={this.handleHoveredLegendSeriesChange}
          />
        )}
        {this.renderHoverTooltip()}
      </GraphContainer>
    );
  }
}

DashboardGraph.defaultProps = {
  colorScheme: largePalette,
  yAxisUnits: numericUnits,
  showStacked: false,
  baseMinValue: 0.0,
  baseMaxValue: 0.012,
  simpleTooltip: false,
  legendCollapsable: false,
  legendShown: true,
  deployments: [],
};

export default DashboardGraph;
