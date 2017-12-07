import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { map, last, clamp } from 'lodash';

import { linearGradientValue } from '../../utils/math';
import {
  formattedTimestamp,
  getTimeScale,
  findOptimalDurationFit,
} from '../../utils/timeline';
import {
  MIN_TICK_SPACING_PX,
  MAX_TICK_SPACING_PX,
  FADE_OUT_FACTOR,
  TICKS_ROW_SPACING,
  MAX_TICK_ROWS,
  TICK_SETTINGS_PER_PERIOD,
} from '../../constants/timeline';


// TODO: Unite with the one in TimeTravel.js
const ShallowButton = styled.button`
  background-color: transparent;
  border: 0;
  color: ${props => props.theme.colors.primary.lavender};
  cursor: pointer;
  padding: 0;
  outline: 0;

  &:hover {
    color: ${props => props.theme.colors.primary.charcoal};
  }
`;

const TimestampLabel = ShallowButton.extend`
  font-size: 13px;
  margin-left: 2px;
  padding: 3px;

  &[disabled] {
    color: ${props => props.theme.colors.gray};
    cursor: inherit;
  }
`;

class PeriodLabels extends React.PureComponent {
  getTicksForPeriod(period, timelineTransform) {
    // First find the optimal duration between the ticks - if no satisfactory
    // duration could be found, don't render any ticks for the given period.
    const { parentPeriod, periodIntervals } = TICK_SETTINGS_PER_PERIOD[period];
    const periodInterval = findOptimalDurationFit(periodIntervals, period, timelineTransform);
    if (!periodInterval) return [];

    // Get the boundary values for the displayed part of the timeline.
    const timeScale = getTimeScale(timelineTransform);
    const halfWidth = this.props.width / 2;
    const momentStart = moment(timeScale.invert(-halfWidth)).utc();
    const momentEnd = moment(timeScale.invert(halfWidth)).utc();

    // Start counting the timestamps from the most recent timestamp that is not shown
    // on screen. The values are always rounded up to the timestamps of the next bigger
    // period (e.g. for days it would be months, for months it would be years).
    let momentTimestamp = moment(momentStart).utc().startOf(parentPeriod || period);
    while (momentTimestamp.isBefore(momentStart)) {
      momentTimestamp = moment(momentTimestamp).add(periodInterval, period);
    }
    momentTimestamp = moment(momentTimestamp).subtract(periodInterval, period);

    // Make that hidden timestamp the first one in the list, but position
    // it inside the visible range with a prepended arrow to the past.
    const ticks = [{
      timestamp: formattedTimestamp(momentTimestamp),
      position: -halfWidth,
      isBehind: true,
    }];

    // Continue adding ticks till the end of the visible range.
    do {
      // If the new timestamp enters into a new bigger period, we round it down to the
      // beginning of that period. E.g. instead of going [Jan 22nd, Jan 29th, Feb 5th],
      // we output [Jan 22nd, Jan 29th, Feb 1st]. Right now this case only happens between
      // days and months, but in theory it could happen whenever bigger periods are not
      // divisible by the duration we are using as a step between the ticks.
      let newTimestamp = moment(momentTimestamp).add(periodInterval, period);
      if (parentPeriod && newTimestamp.get(parentPeriod) !== momentTimestamp.get(parentPeriod)) {
        newTimestamp = moment(newTimestamp).utc().startOf(parentPeriod);
      }
      momentTimestamp = newTimestamp;

      // If the new tick is too close to the previous one, drop that previous tick.
      const position = timeScale(momentTimestamp);
      const previousPosition = last(ticks) && last(ticks).position;
      if (position - previousPosition < MIN_TICK_SPACING_PX) {
        ticks.pop();
      }

      ticks.push({ timestamp: formattedTimestamp(momentTimestamp), position });
    } while (momentTimestamp.isBefore(momentEnd));

    return ticks;
  }

  getVerticalShiftForPeriod(period, { durationMsPerPixel }) {
    const { childPeriod, parentPeriod } = TICK_SETTINGS_PER_PERIOD[period];

    let shift = 1;
    if (parentPeriod) {
      const durationMultiplier = 1 / MAX_TICK_SPACING_PX;
      const parentInterval = TICK_SETTINGS_PER_PERIOD[parentPeriod].periodIntervals[0];
      const parentIntervalMs = moment.duration(parentInterval, parentPeriod).asMilliseconds();
      const fadedInDurationMs = parentIntervalMs * durationMultiplier;
      const fadedOutDurationMs = fadedInDurationMs * FADE_OUT_FACTOR;

      const transitionFactor = Math.log(fadedOutDurationMs) - Math.log(durationMsPerPixel);
      const transitionLength = Math.log(fadedOutDurationMs) - Math.log(fadedInDurationMs);

      shift = clamp(transitionFactor / transitionLength, 0, 1);
    }

    if (childPeriod) {
      shift += this.getVerticalShiftForPeriod(childPeriod, { durationMsPerPixel });
    }

    return shift;
  }

  renderTimestampTick({ timestamp, position, isBehind }, periodFormat, opacity) {
    const disabled = (opacity < 0.4
      || timestamp > this.props.clickableEndAt
      || timestamp < this.props.clickableStartAt
    );
    const handleClick = () => {
      if (!disabled) {
        this.props.onClick(timestamp);
      }
    };

    return (
      <g transform={`translate(${position}, 0)`} key={timestamp}>
        {!isBehind && <line y2="75" stroke="#ddd" strokeWidth="1" />}
        {!disabled && <title>Jump to {timestamp}</title>}
        <foreignObject width="100" height="20" style={{ lineHeight: '20px' }}>
          <TimestampLabel disabled={disabled} onClick={handleClick}>
            {moment(timestamp).utc().format(periodFormat)}
          </TimestampLabel>
        </foreignObject>
      </g>
    );
  }

  render() {
    const { period } = this.props;
    const periodFormat = TICK_SETTINGS_PER_PERIOD[period].format;
    const ticks = this.getTicksForPeriod(period, this.props);

    const ticksRow = MAX_TICK_ROWS - this.getVerticalShiftForPeriod(period, this.props);
    const transform = `translate(0, ${ticksRow * TICKS_ROW_SPACING})`;

    // Ticks quickly fade in from the bottom and then slowly start
    // fading out towards the top until they are pushed out of canvas.
    const focusedRow = MAX_TICK_ROWS - 1;
    const opacity = ticksRow > focusedRow ?
      linearGradientValue(ticksRow, [MAX_TICK_ROWS, focusedRow]) :
      linearGradientValue(ticksRow, [-2, focusedRow]);

    return (
      <g className={period} transform={transform} style={{ opacity }}>
        {map(ticks, tick => this.renderTimestampTick(tick, periodFormat, opacity))}
      </g>
    );
  }
}

PeriodLabels.propTypes = {
  period: PropTypes.string,
  focusedTimestamp: PropTypes.string,
  durationMsPerPixel: PropTypes.integer,
  width: PropTypes.integer,
  clickableStartAt: PropTypes.string,
  clickableEndAt: PropTypes.string,
  onClick: PropTypes.func,
};

export default PeriodLabels;
