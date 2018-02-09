import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  max,
  flatten,
  flatMap,
  range,
  values,
  sortBy,
  first,
  last,
} from 'lodash';
import { scaleLinear, scaleQuantize } from 'd3-scale';
import { format, formatPrefix, precisionPrefix, precisionFixed } from 'd3-format';
import { stack } from 'd3-shape';

import Chart from './_Chart';
import AxesGrid from './_AxesGrid';
import DeploymentAnnotations from './_DeploymentAnnotations';
import HoverInfo from './_HoverInfo';
import Legend from './_Legend';

function parseGraphValue(value) {
  const val = parseFloat(value);
  if (Number.isNaN(val)) {
    // "+Inf", "-Inf", "+Inf" will be parsed into NaN by parseFloat(). The
    // can't be graphed, so show them as gaps (null).
    return null;
  }
  return val;
}

const GraphWrapper = styled.div`
  position: relative;
  margin-left: 45px;
`;

const GraphContainer = styled.div`
  position: relative;
  min-height: 170px;
  margin-bottom: 20px;
`;

const AxisLabel = styled.span`
  color: ${props => props.theme.colors.neutral.black};
  font-size: ${props => props.theme.fontSizes.normal};
  transform: translate(-60px, 165px) rotate(-90deg);
  transform-origin: left top 0;
  display: inline-block;
`;

const colorThemes = {
  blue: (index) => {
    // http://colorbrewer2.org/#type=sequential&scheme=YlGnBu&n=9 from d3 without 2 lightest colours
    const colors = [
      'hsl(98, 55%, 81%)',
      'hsl(166, 44%, 65%)',
      'hsl(196, 84%, 52%)', // Weaveworks 'blue accent' color, not interpolated because it looked too dark
      'hsl(197, 74%, 43%)',
      'hsl(213, 66%, 40%)',
      'hsl(232, 60%, 36%)',
      'hsl(212, 88%, 27%)',
    ];
    return colors[index % colors.length];
  },
  purple: (index) => {
    // http://colorbrewer2.org/#type=sequential&scheme=BuPu&n=9 without 2 lightest colours
    const colors = [
      'hsl(209, 44%, 83%)',
      'hsl(210, 45%, 74%)',
      'hsl(230, 34%, 66%)',
      'hsl(240, 20%, 59%)', // Weaveworks 'lavender' color
      'hsl(286, 41%, 44%)',
      'hsl(303, 79%, 28%)',
      'hsl(248, 82%, 11%)', // Weaveworks 'charcoal' color interpolated for 75% opacity
    ];
    return colors[index % colors.length];
  },
  mixed: (index) => {
    const colors = flatMap(range(7), i => [
      colorThemes.blue(i),
      colorThemes.purple(i),
    ]);
    return colors[index % colors.length];
  },
};

const valueFormatters = {
  none: (number) => {
    const step = number / 7;
    const formatNumber = number > 10
      ? formatPrefix(`.${precisionPrefix(step, number)}`, number)
      : format(`.${precisionFixed(step)}f`);
    return (n) => {
      if (n === null) return '---';
      if (n === 0) return '0';
      return formatNumber(n);
    };
  },
  bytes: (maxBytes) => {
    const data = [
      { label: 'TB', unit: 1024 * 1024 * 1024 * 1024 },
      { label: 'GB', unit: 1024 * 1024 * 1024 },
      { label: 'MB', unit: 1024 * 1024 },
      { label: 'kB', unit: 1024 },
      { label: 'B', unit: 1 },
    ].find(({ unit }) => maxBytes / unit >= 2);
    return (n) => {
      if (n === null) return '---';
      if (!data) return '0';
      return `${Math.round(n / data.unit)} ${data.label}`;
    };
  },
  percent: () => {
    const formatPercent = format('.2%');
    return (n) => {
      if (n === null) return '---';
      if (n === 0) return '0%';
      return formatPercent(n);
    };
  },
};

class PrometheusGraph extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      multiSeries: [],
      selectedLegendSeriesKey: null,
      hoveredLegendSeriesKey: null,
      hoverTimestampSec: null,
      hoverPoints: null,
      hoverX: null,
      hoverY: null,
      chartWidth: 0,
      chartHeight: 0,
    };

    this.processMultiSeries = this.processMultiSeries.bind(this);

    this.handleSelectedLegendSeriesChange = this.handleSelectedLegendSeriesChange.bind(this);
    this.handleHoveredLegendSeriesChange = this.handleHoveredLegendSeriesChange.bind(this);
    this.handleHoverUpdate = this.handleHoverUpdate.bind(this);
    this.handleChartResize = this.handleChartResize.bind(this);
  }

  componentWillMount() {
    this.processMultiSeries(this.props);
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

  handleHoverUpdate({ hoverPoints, hoverTimestampSec, hoverX, hoverY }) {
    this.setState({ hoverPoints, hoverTimestampSec, hoverX, hoverY });
  }

  handleChartResize({ chartWidth, chartHeight }) {
    this.setState({ chartWidth, chartHeight });
  }

  processMultiSeries(props) {
    // Get the sorted list of names for all the series.
    const multiSeriesNames = props.multiSeries
      .map(series => props.getSeriesName(series))
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
    const valuesForStacking = sortBy(values(valuesByTimestamp), ['timestampSec']);
    const stackFunction = stack().keys(multiSeriesNames);
    const stackedData = stackFunction(valuesForStacking);

    // Finally store the multi-series ready to be graphed.
    const getColor = colorThemes[props.colorTheme];
    const multiSeries = multiSeriesNames.map((seriesName, seriesIndex) => ({
      name: seriesName,
      key: `${seriesName}:${seriesIndex}`,
      color: getColor(seriesIndex),
      datapoints: timestampSecs.map((timestampSec, timestampIndex) => ({
        timestampSec,
        value: valuesByTimestamp[timestampSec][seriesName],
        offset: stackedData[seriesIndex][timestampIndex][0],
      })),
    }));

    this.setState({ multiSeries });
  }

  getMaxGraphValue() {
    const yPositions = flatten(
      this.getVisibleMultiSeries().map(series =>
        series.datapoints.map(datapoint =>
          this.getDatapointGraphValue(datapoint)
        )
      )
    );
    return max([this.props.valuesMinSpread, ...yPositions]);
  }

  getTimestampQuantizer(props = this.props) {
    const { startTimeSec, endTimeSec, stepDurationSec } = props;
    // Timestamp values are stepDurationSec seconds apart and they always end at
    // endTimeSec. We make startTimeSec a bit smaller to include it in the range in case
    // (endTimeSec - startTimeSec) is divisible by stepDurationSec.
    const timestampSecs = range(
      endTimeSec,
      startTimeSec - 1e-6,
      -stepDurationSec
    ).sort();
    // scaleQuantize would normally map domain in buckets of uniform lengths. To
    // make it map to the nearest point in timestampSecs instead, we need to extend
    // the domain by half of stepDurationSec at each end.
    const startDomain = first(timestampSecs) - (0.5 * stepDurationSec);
    const endDomain = last(timestampSecs) + (0.5 * stepDurationSec);
    return scaleQuantize()
      .domain([startDomain, endDomain])
      .range(timestampSecs);
  }

  getTimeScale() {
    const { chartWidth } = this.state;
    const { startTimeSec, endTimeSec } = this.props;
    return scaleLinear()
      .domain([startTimeSec, endTimeSec])
      .range([0, chartWidth]);
  }

  getValueScale() {
    const { chartHeight } = this.state;
    const maxGraphValue = this.getMaxGraphValue();
    return scaleLinear()
      .domain([0, maxGraphValue])
      .range([chartHeight, 0]);
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

  render() {
    const {
      yAxisLabel, deployments, metricUnits, showStacked, simpleTooltip,
      legendShown, legendCollapsable,
    } = this.props;
    const {
      selectedLegendSeriesKey, hoveredLegendSeriesKey, chartWidth, chartHeight,
      hoverPoints, hoverTimestampSec, hoverX, hoverY, multiSeries,
    } = this.state;

    const timeScale = this.getTimeScale();
    const valueScale = this.getValueScale();
    const visibleMultiSeries = this.getVisibleMultiSeries();
    const timestampQuantizer = this.getTimestampQuantizer();
    const valueFormatter = valueFormatters[metricUnits];

    return (
      <GraphWrapper>
        <AxisLabel>{yAxisLabel}</AxisLabel>
        <GraphContainer>
          <AxesGrid
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            timeScale={timeScale}
            valueScale={valueScale}
            valueFormatter={valueFormatter}
            metricUnits={metricUnits}
          />
          <Chart
            showStacked={showStacked}
            timeScale={timeScale}
            valueScale={valueScale}
            multiSeries={visibleMultiSeries}
            timestampQuantizer={timestampQuantizer}
            selectedLegendSeriesKey={selectedLegendSeriesKey}
            hoveredLegendSeriesKey={hoveredLegendSeriesKey}
            onHoverUpdate={this.handleHoverUpdate}
            onChartResize={this.handleChartResize}
          />
          <DeploymentAnnotations
            deployments={deployments}
            timeScale={timeScale}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
          <HoverInfo
            mouseX={hoverX}
            mouseY={hoverY}
            datapoints={hoverPoints}
            timestampSec={hoverTimestampSec}
            simpleTooltip={simpleTooltip}
            valueFormatter={valueFormatter}
            valueScale={valueScale}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
          />
        </GraphContainer>
        <Legend
          multiSeries={multiSeries}
          legendShown={legendShown}
          legendCollapsable={legendCollapsable}
          onSelectedLegendSeriesChange={this.handleSelectedLegendSeriesChange}
          onHoveredLegendSeriesChange={this.handleHoveredLegendSeriesChange}
        />
      </GraphWrapper>
    );
  }
}

PrometheusGraph.propTypes = {
  /**
   * List of datapoints to be rendered in the graph
   */
  multiSeries: PropTypes.array.isRequired,
  /**
   * Granularity in seconds between adjacent datapoints across the time scale
   */
  stepDurationSec: PropTypes.number.isRequired,
  /**
   * Start timestamp of the rendered chart (unix timestamp)
   */
  startTimeSec: PropTypes.number.isRequired,
  /**
   * End timestamp of the rendered chart (unix timestamp)
   */
  endTimeSec: PropTypes.number.isRequired,
  /**
   * Method that builds series name from its metadata
   */
  getSeriesName: PropTypes.func.isRequired,
  /**
   * Color theme for the graph
   */
  colorTheme: PropTypes.oneOf(['mixed', 'blue', 'purple']),
  /**
   * Series values format
   */
  metricUnits: PropTypes.oneOf(['none', 'bytes', 'percent']),
  /**
   * Minimal allowed length of the Y-axis values spread
   */
  valuesMinSpread: PropTypes.number,
  /**
   * If true, shows the stacked area graph, otherwise show a simple line graph
   */
  showStacked: PropTypes.bool,
  /**
   * If true, show only data for one series in the tooltip, otherwise show all
   */
  simpleTooltip: PropTypes.bool,
  /**
   * Making graph legend section collapsable
   */
  legendCollapsable: PropTypes.bool,
  /**
   * Display legend section initially
   */
  legendShown: PropTypes.bool,
  /**
   * Optional list of deployment annotations shown over the graph
   */
  deployments: PropTypes.array,
};

PrometheusGraph.defaultProps = {
  colorTheme: 'mixed',
  metricUnits: 'none',
  valuesMinSpread: 0.012,
  showStacked: false,
  simpleTooltip: false,
  legendCollapsable: false,
  legendShown: true,
  deployments: [],
};

export default PrometheusGraph;
