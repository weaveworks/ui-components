import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  first,
  flatten,
  forEach,
  fromPairs,
  get,
  head,
  indexOf,
  isEmpty,
  keys,
  last,
  max,
  min,
  noop,
  omit,
  range,
  reverse,
  size,
  sortBy,
  values,
  zipObject,
} from 'lodash';
import { scaleLinear, scaleQuantize } from 'd3-scale';
import {
  format,
  formatPrefix,
  precisionPrefix,
  precisionFixed,
} from 'd3-format';
import { stack } from 'd3-shape';

import theme from '../../theme';
import { spacing } from '../../theme/selectors';

import Chart from './_Chart';
import AxesGrid from './_AxesGrid';
import ErrorOverlay from './_ErrorOverlay';
import LoadingOverlay from './_LoadingOverlay';
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

function asJSONString(hash) {
  // Return empty string instead of empty hash.
  if (isEmpty(hash)) return '';

  return JSON.stringify(hash, null, 1);
}

function getDefaultSeriesNameParts(series) {
  // Extract metric name in a separate variable.
  const metricName = get(series.metric, '__name__') || '';
  const metricHash = omit(series.metric, ['__name__']);

  // Handle some special cases if metric name is not present.
  if (!metricName) {
    // Return the query string if the series has no metrics.
    if (isEmpty(metricHash)) {
      return [series.query];
    }
    // Return the value if only a single one is present.
    if (size(metricHash) === 1) {
      return [first(values(metricHash))];
    }
  }

  // Return a stringified JSON of metrics
  // (with metric name in front if it exists).
  return [`${metricName}${asJSONString(metricHash)}`];
}

function getColorTheme({ colorTheme, showStacked }) {
  return index => {
    const colors = [...theme.colors.graphThemes[colorTheme]];

    // Reverse the order of colors for line graphs for improved visibility.
    if (!showStacked) reverse(colors);

    return colors[index % colors.length];
  };
}

const GraphWrapper = styled.div`
  position: relative;
  padding-left: ${spacing('xl')};
`;

const GraphContainer = styled.div`
  position: relative;
  min-height: 170px;
  margin-bottom: ${spacing('medium')};
  opacity: ${props => (props.loading ? 0.35 : 1)};
`;

const AxisLabel = styled.span`
  color: ${props => props.theme.colors.black};
  font-size: ${props => props.theme.fontSizes.normal};
  opacity: ${props => (props.loading ? 0.35 : 1)};
  transform: translate(-60px, 165px) rotate(-90deg);
  transform-origin: left top 0;
  display: inline-block;
`;

const valueFormatters = {
  bytes: maxBytes => {
    const data = [
      { label: 'TB', unit: 1024 * 1024 * 1024 * 1024 },
      { label: 'GB', unit: 1024 * 1024 * 1024 },
      { label: 'MB', unit: 1024 * 1024 },
      { label: 'kB', unit: 1024 },
      { label: 'B', unit: 1 },
    ].find(({ unit }) => maxBytes / unit >= 2);
    return n => {
      if (n === null) return '---';
      if (!data) return '0';
      return `${Math.round(n / data.unit)} ${data.label}`;
    };
  },
  numeric: number => {
    const step = number / 7;
    const formatNumber =
      number > 10
        ? formatPrefix(`.${precisionPrefix(step, number)}`, number)
        : format(`.${precisionFixed(step)}f`);
    return n => {
      if (n === null) return '---';
      if (n === 0) return '0';
      return formatNumber(n);
    };
  },
  percent: () => {
    const formatPercent = format('.2%');
    return n => {
      if (n === null) return '---';
      if (n === 0) return '0%';
      return formatPercent(n);
    };
  },
  seconds: maxSeconds => {
    const data = [
      { label: 'w', unit: 7 * 24 * 60 * 60 },
      { label: 'd', unit: 24 * 60 * 60 },
      { label: 'h', unit: 60 * 60 },
      { label: 'm', unit: 60 },
      { label: 's', unit: 1 },
      { label: 'ms', unit: 1 / 1000 },
      { label: 'µs', unit: 1 / 1000 / 1000 },
    ].find(({ unit }) => maxSeconds / unit >= 2);
    return n => {
      if (n === null) return '---';
      if (!data) return '0';
      return `${Math.round(n / data.unit)} ${data.label}`;
    };
  },
};

/**
 * Renders a graph based on Prometheus data fed through `multiSeries` prop.
 * Optionally adds deployment annotations to the graph.
 *
 * ```javascript
 * export default class PrometheusGraphExample extends React.Component {
 *   constructor() {
 *     super();
 *
 *     this.state = {
 *       multiSeries: ...,
 *       startTime: moment('2018-02-05T11:24:14Z').unix(),
 *       endTime: moment('2018-02-05T11:54:14Z').unix(),
 *       stepDuration: 9,
 *     };
 *   }
 *
 *   render() {
 *     return (
 *       <PrometheusGraph
 *         showStacked
 *         multiSeries={this.state.multiSeriesJobs}
 *         stepDurationSec={this.state.stepDuration}
 *         startTimeSec={this.state.startTime}
 *         endTimeSec={this.state.endTime}
 *         getSeriesNameParts={({ metric }) => JSON.stringify(metric)}
 *       />
 *     );
 *   }
 * }
 * ```
 *
 */
class PrometheusGraph extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      chartHeight: 0,
      chartWidth: 0,
      hoveredLegendKey: null,
      hoverPoints: null,
      hoverTimestampSec: null,
      hoverX: null,
      hoverY: null,
      multiSeries: [],
      selectedLegendKeys: props.selectedLegendKeys,
      timeScale: null,
      valueScale: null,
    };
  }

  componentWillMount() {
    this.prepareMultiSeries(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.multiSeries !== nextProps.multiSeries) {
      this.prepareMultiSeries(nextProps);
    }

    if (this.props.selectedLegendKeys !== nextProps.selectedLegendKeys) {
      const { selectedLegendKeys } = nextProps;
      this.prepareMultiSeries(nextProps, { selectedLegendKeys });
      this.setState({ selectedLegendKeys });
    }
  }

  handleSelectedLegendKeysChange = selectedLegendKeys => {
    this.prepareMultiSeries(this.props, { selectedLegendKeys });
    this.setState({ selectedLegendKeys });
    this.props.onChangeLegendSelection(selectedLegendKeys);
  };

  handleHoveredLegendKeyChange = hoveredLegendKey => {
    this.setState({ hoveredLegendKey });
  };

  handleHoverUpdate = ({ hoverPoints, hoverTimestampSec, hoverX, hoverY }) => {
    this.setState({
      hoverPoints,
      hoverTimestampSec,
      hoverX,
      hoverY,
    });
  };

  handleChartResize = ({ chartWidth, chartHeight }) => {
    this.setState({
      ...this.prepareTimeAndValueScales(
        this.props,
        this.state.visibleMultiSeries
      ),

      chartHeight,
      chartWidth,
    });
  };

  prepareMultiSeries = (props, { selectedLegendKeys } = this.state) => {
    const getSeriesColor = getColorTheme(props);
    const getSeriesNameParts = series =>
      props.getSeriesNameParts(series, props.multiSeries);

    // The key generating function will make series key equal the series name,
    // unless this is not the first series with this name, in which case the
    // index of the series within the legend is attached to the key.
    const multiSeriesByName = props.multiSeries.map(getSeriesNameParts);
    const getDefaultSeriesKey = (series, index) => {
      const seriesName = head(getSeriesNameParts(series));
      const firstIndex = indexOf(multiSeriesByName, seriesName);

      let seriesKey = seriesName;
      if (firstIndex !== index) {
        seriesKey = `${seriesKey}____${index}`;
      }
      return seriesKey;
    };

    // Use default key assigner only if no explicit one has been provided.
    const getSeriesKey = props.getSeriesKey || getDefaultSeriesKey;

    // Build a dictionary that references original multi series by keys,
    // and a sorted list of those keys by which we can later iterate.
    const getSeriesKeyValuePair = (series, index) => [
      getSeriesKey(series, index),
      series,
    ];
    const multiSeriesByKey = fromPairs(
      props.multiSeries.map(getSeriesKeyValuePair)
    );
    const multiSeriesKeys = keys(multiSeriesByKey).sort();

    // Calculate the keys of stacked series:
    //   1. If the graph isn't stacked, then this array should be empty.
    //   2. If the graph is stacked and some series are selected, only
    //      those selected ones will be displayed so only stack them.
    //   3. If the graph is stacked and no series is selected, all the
    //      series are displayed, so they should all be stacked.
    let stackedMultiSeriesKeys = [];
    if (props.showStacked) {
      stackedMultiSeriesKeys =
        selectedLegendKeys.length > 0 ? selectedLegendKeys : multiSeriesKeys;
    }

    // This D3 scale takes care of rounding all the datapoints to the nearest discrete timestamp.
    const timestampQuantizer = this.getTimestampQuantizer(props);
    const timestampSecs = timestampQuantizer.range();

    // Initialize all the graph values to null, as if the graph was empty.
    const valuesByTimestamp = {};
    timestampSecs.forEach(timestampSec => {
      valuesByTimestamp[timestampSec] = { timestampSec };
      multiSeriesKeys.forEach(seriesKey => {
        valuesByTimestamp[timestampSec][seriesKey] = null;
      });
    });

    // Go through the datapoints of all the series and fill in
    // their values (in a format that works for D3 stack helpers).
    forEach(multiSeriesByKey, (series, seriesKey) => {
      forEach(series.values, point => {
        const value = parseGraphValue(point[1]);
        const timestampSec = timestampQuantizer(point[0]);
        valuesByTimestamp[timestampSec][seriesKey] = value;
      });
    });

    // Stack the graph series in the alphabetical order.
    const stackFunction = stack().keys(stackedMultiSeriesKeys);
    const valuesForStacking = sortBy(values(valuesByTimestamp), [
      'timestampSec',
    ]);
    const stackedData = zipObject(
      stackedMultiSeriesKeys,
      stackFunction(valuesForStacking)
    );
    const getStackedOffset = (seriesKey, timestampIndex) =>
      stackedMultiSeriesKeys.includes(seriesKey)
        ? stackedData[seriesKey][timestampIndex][0]
        : 0;

    // Finally store the multi-series ready to be graphed.
    const multiSeries = multiSeriesKeys.map((seriesKey, seriesIndex) => ({
      color: getSeriesColor(seriesIndex),
      datapoints: timestampSecs.map((timestampSec, timestampIndex) => ({
        offset: getStackedOffset(seriesKey, timestampIndex),
        timestampSec,
        value: valuesByTimestamp[timestampSec][seriesKey],
      })),
      hoverName: getSeriesNameParts(multiSeriesByKey[seriesKey]),
      key: seriesKey,
      legendNameParts: getSeriesNameParts(multiSeriesByKey[seriesKey], true),
    }));

    const visibleMultiSeries = // If no series is selected, show all of them.
      this.state.selectedLegendKeys.length === 0
        ? multiSeries
        : // Otherwise show only the selected multi series.
          multiSeries.filter(series =>
            this.state.selectedLegendKeys.includes(series.key)
          );

    const { timeScale, valueScale } = this.prepareTimeAndValueScales(
      props,
      visibleMultiSeries
    );

    this.setState({
      multiSeries,
      timeScale,
      valueScale,
      visibleMultiSeries,
    });
  };

  prepareTimeAndValueScales = (props, multiseries) => {
    let chartWidth;
    let chartHeight;

    if (this.chartRef) {
      ({
        width: chartWidth,
        height: chartHeight,
      } = this.chartRef.getSvgBoundingRect());
    } else {
      ({ chartHeight, chartWidth } = this.state);
    }

    const timeScale = this.getTimeScale(props, chartWidth);
    const valueScale = this.getValueScale(props, multiseries, chartHeight);

    return {
      timeScale,
      valueScale,
    };
  };

  getMaxMinGraphValue(props, visibleMultiSeries) {
    const yPositions = flatten(
      visibleMultiSeries.map(series =>
        series.datapoints.map(datapoint => datapoint.offset + datapoint.value)
      )
    );

    return {
      max: max([props.valuesMinSpread * 1.05, ...yPositions]),
      min: min([0, ...yPositions]),
    };
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
    // prettier-ignore - https://github.com/prettier/prettier/issues/187
    const startDomain = first(timestampSecs) - (0.5 * stepDurationSec); // prettier-ignore
    const endDomain = last(timestampSecs) + (0.5 * stepDurationSec); // prettier-ignore
    return scaleQuantize()
      .domain([startDomain, endDomain])
      .range(timestampSecs);
  }

  getTimeScale(props, chartWidth) {
    const { startTimeSec, endTimeSec } = props;
    return scaleLinear()
      .domain([startTimeSec, endTimeSec])
      .range([0, chartWidth]);
  }

  getValueScale(props, visibleMultiSeries, chartHeight) {
    const { max: maxGraphValue, min: minGraphValue } = this.getMaxMinGraphValue(
      props,
      visibleMultiSeries
    );
    return scaleLinear()
      .domain([minGraphValue, maxGraphValue])
      .range([chartHeight, 0]);
  }

  render() {
    const {
      yAxisLabel,
      deployments,
      deploymentsLinkBuilder,
      onDeploymentClick,
      metricUnits,
      showStacked,
      simpleTooltip,
      legendShown,
      legendCollapsable,
      loading,
      error,
    } = this.props;
    const {
      selectedLegendKeys,
      hoveredLegendKey,
      chartWidth,
      chartHeight,
      hoverPoints,
      hoverTimestampSec,
      hoverX,
      hoverY,
      multiSeries,
      valueScale,
      timeScale,
      visibleMultiSeries,
    } = this.state;

    if (!valueScale || !timeScale) {
      return null;
    }

    const timestampQuantizer = this.getTimestampQuantizer();
    const valueFormatter = valueFormatters[metricUnits];
    const hasData = multiSeries && multiSeries.length > 0;

    return (
      <GraphWrapper>
        <AxisLabel loading={loading}>{yAxisLabel}</AxisLabel>
        <GraphContainer loading={loading}>
          <AxesGrid
            hasData={hasData}
            chartWidth={chartWidth}
            chartHeight={chartHeight}
            timeScale={timeScale}
            valueScale={valueScale}
            valueFormatter={valueFormatter}
            metricUnits={metricUnits}
          />
          <Chart
            ref={el => {
              if (el) {
                this.chartRef = el;
              }
            }}
            showStacked={showStacked}
            timeScale={timeScale}
            valueScale={valueScale}
            multiSeries={visibleMultiSeries}
            timestampQuantizer={timestampQuantizer}
            selectedLegendKeys={selectedLegendKeys}
            hoveredLegendKey={hoveredLegendKey}
            onHoverUpdate={this.handleHoverUpdate}
            onChartResize={this.handleChartResize}
          />
          {hasData && (
            <DeploymentAnnotations
              onClick={onDeploymentClick}
              linkBuilder={deploymentsLinkBuilder}
              deployments={deployments}
              timeScale={timeScale}
              chartWidth={chartWidth}
              chartHeight={chartHeight}
            />
          )}
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
          loading={loading}
          shown={legendShown}
          collapsable={legendCollapsable}
          selectedKeys={selectedLegendKeys}
          hoveredKey={hoveredLegendKey}
          renderItemSuffix={this.props.renderLegendItemSuffix}
          onSelectedKeysChange={this.handleSelectedLegendKeysChange}
          onHoveredKeyChange={this.handleHoveredLegendKeyChange}
          multiSeries={multiSeries}
        />
        <ErrorOverlay hasData={hasData} loading={loading} error={error} />
        <LoadingOverlay loading={loading} />
      </GraphWrapper>
    );
  }
}

PrometheusGraph.propTypes = {
  /**
   * Color theme for the graph
   */
  colorTheme: PropTypes.oneOf(['mixed', 'blue', 'purple']),
  /**
   * Optional list of deployment annotations shown over the graph
   */
  deployments: PropTypes.array,
  /**
   * Optional function that builds links that deployment clicks should lead to
   */
  deploymentsLinkBuilder: PropTypes.func,
  /**
   * End timestamp of the rendered chart (unix timestamp)
   */
  endTimeSec: PropTypes.number.isRequired,
  /**
   * If set, shows the error message over the graph
   */
  error: PropTypes.string,
  /**
   * Optional method that generates the series key based on its data.
   */
  getSeriesKey: PropTypes.func,
  /**
   * Method that builds series name from its metadata. First argument should be the series
   * itself, second argument multiSeries context and third argument options hash with only
   */
  getSeriesNameParts: PropTypes.func,
  /**
   * Making graph legend section collapsable
   */
  legendCollapsable: PropTypes.bool,
  /**
   * Display legend section initially
   */
  legendShown: PropTypes.bool,
  /**
   * If true, shows a loading overlay on top of the graph
   */
  loading: PropTypes.bool,
  /**
   * Series values format
   */
  metricUnits: PropTypes.oneOf(['numeric', 'seconds', 'bytes', 'percent']),
  /**
   * List of datapoints to be rendered in the graph
   */
  multiSeries: PropTypes.array.isRequired,
  /**
   * Called when legend selection changes
   */
  onChangeLegendSelection: PropTypes.func,
  /**
   * Optional hook for deployment annotation clicks
   */
  onDeploymentClick: PropTypes.func,
  /**
   * Optional content to be appended to the ending of the legend item
   */
  renderLegendItemSuffix: PropTypes.func,
  /**
   * Initially preselected legend items
   */
  selectedLegendKeys: PropTypes.array,
  /**
   * If true, shows the stacked area graph, otherwise show a simple line graph
   */
  showStacked: PropTypes.bool,
  /**
   * If true, show only data for one series in the tooltip, otherwise show all
   */
  simpleTooltip: PropTypes.bool,
  /**
   * Start timestamp of the rendered chart (unix timestamp)
   */
  startTimeSec: PropTypes.number.isRequired,
  /**
   * Granularity in seconds between adjacent datapoints across the time scale
   */
  stepDurationSec: PropTypes.number.isRequired,
  /**
   * Minimal allowed length of the Y-axis values spread
   */
  valuesMinSpread: PropTypes.number,
};

PrometheusGraph.defaultProps = {
  colorTheme: 'mixed',
  deployments: [],
  deploymentsLinkBuilder: noop,
  error: '',
  getSeriesKey: undefined,
  getSeriesNameParts: getDefaultSeriesNameParts,
  legendCollapsable: false,
  legendShown: true,
  loading: false,
  metricUnits: 'numeric',
  onChangeLegendSelection: noop,
  onDeploymentClick: noop,
  renderLegendItemSuffix: noop,
  selectedLegendKeys: [],
  showStacked: false,
  simpleTooltip: false,
  valuesMinSpread: 0.012,
};

export default PrometheusGraph;
