import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { find, range, flatMap } from 'lodash';

const AxesGridContainer = styled.div``;

const AxisLine = styled.div.attrs({
  style: ({ width = 0, height = 0 }) => ({ width, height }),
})`
  border-style: dashed;
  border-color: ${props => props.theme.colors.gray200};
  position: absolute;
  left: 0;
  top: 0;
`;

const HorizontalLine = AxisLine.extend`
  border-width: 1px 0 0 0;
`;

const VerticalLine = AxisLine.extend`
  border-width: 0 0 0 1px;
`;

const TickContainer = styled.div.attrs({
  style: ({ left = 0, top = 0 }) => ({ left, top }),
})`
  position: absolute;
`;

const TickLabel = styled.span`
  color: ${props => props.theme.colors.gray600};
  font-size: ${props => props.theme.fontSizes.tiny};
  display: block;
  position: absolute;
  white-space: nowrap;
`;

const ValueTickLabel = TickLabel.extend`
  top: -8px;
  right: 5px;
`;

const TimeTickLabel = TickLabel.extend`
  top: ${props => props.height + 5}px;
  left: 0;
`;

function formatTimeTick(timeSec) {
  const timestamp = moment(timeSec * 1000).utc();

  // Show month and day at every full day.
  const startOfDay = timestamp.clone().startOf('day');
  if (timestamp.diff(startOfDay) === 0) {
    return timestamp.format('MMM DD');
  }

  // Show hour and minute at every full minute.
  const startOfMinute = timestamp.clone().startOf('minute');
  if (timestamp.diff(startOfMinute) === 0) {
    return timestamp.format('HH:mm');
  }

  // Otherwise show only the seconds context.
  return timestamp.format("ss'");
}

function getTimeTicksBetween(startTimeSec, endTimeSec) {
  // 1s, 2s, 5s, 15s, 30s, 1min, 2min, 5min, 15min, 30min, 1h, 2h, 4h, 8h intervals
  const stepsSec = [
    1,
    2,
    5,
    15,
    30,
    60,
    120,
    300,
    900,
    1800,
    3600,
    7200,
    14400,
    28800,
  ];

  // Tweak the step to show a reasonable number of ticks.
  const stepSec = find(stepsSec, s => (endTimeSec - startTimeSec) / s < 8);

  // Round up the time ticks to the time ticks step precision.
  const initialTickSec = Math.ceil(startTimeSec / stepSec) * stepSec;
  return range(initialTickSec, endTimeSec, stepSec);
}

function getValueTicks(metricUnits, maxValue) {
  /* eslint-disable no-restricted-properties */
  const powersOf10 = range(-6, 15).map(p => Math.pow(10, p));
  const steps =
    metricUnits !== 'bytes'
      ? flatMap(powersOf10, p => [p, 2 * p, 5 * p])
      : range(50).map(p => Math.pow(2, p));
  /* eslint-enable no-restricted-properties */

  const step = find(steps, s => maxValue / s < 4);
  return range(0, maxValue, step);
}

class AxesGrid extends React.PureComponent {
  render() {
    const {
      chartWidth,
      chartHeight,
      timeScale,
      valueScale,
      metricUnits,
      hasData,
    } = this.props;
    if (!chartWidth || !chartHeight || !hasData) return null;

    const yAxisMax = valueScale.domain()[1];
    const [startTimeSec, endTimeSec] = timeScale.domain();
    const timeTicks = getTimeTicksBetween(startTimeSec, endTimeSec);
    const valueTicks = getValueTicks(metricUnits, yAxisMax);
    const formatValue = this.props.valueFormatter(yAxisMax);

    return (
      <AxesGridContainer>
        {valueTicks.map(value => (
          <TickContainer key={value} top={valueScale(value)}>
            <HorizontalLine width={chartWidth} />
            <ValueTickLabel>{formatValue(value)}</ValueTickLabel>
          </TickContainer>
        ))}
        {timeTicks.map(timeSec => (
          <TickContainer key={timeSec} left={timeScale(timeSec)}>
            <VerticalLine height={chartHeight} />
            <TimeTickLabel height={chartHeight}>
              {formatTimeTick(timeSec)}
            </TimeTickLabel>
          </TickContainer>
        ))}
      </AxesGridContainer>
    );
  }
}

AxesGrid.propTypes = {
  hasData: PropTypes.bool.isRequired,
  chartWidth: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  valueScale: PropTypes.func.isRequired,
  valueFormatter: PropTypes.func.isRequired,
  metricUnits: PropTypes.string.isRequired,
};

export default AxesGrid;
