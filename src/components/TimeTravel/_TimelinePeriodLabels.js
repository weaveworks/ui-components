import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { find, map, last, clamp } from 'lodash';

import { formattedTimestamp, getTimeScale } from '../../utils/timeline';
import { MAX_TICK_SPACING_PX } from '../../constants/timeline';

import TimelineLabel from './_TimelineLabel';

const MAX_TICK_ROWS = 3;
const MIN_TICK_SPACING_PX = 70;
const TICKS_ROW_SPACING = 16;
const FADE_OUT_FACTOR = 1.4;

const TICK_SETTINGS_PER_PERIOD = {
  year: {
    format: 'YYYY',
    childPeriod: 'month',
    periodIntervals: [1], // 1 year
  },
  month: {
    format: 'MMMM',
    parentPeriod: 'year',
    childPeriod: 'day',
    periodIntervals: [1, 3], // 1 month, 1 quarter
  },
  day: {
    format: 'Do',
    parentPeriod: 'month',
    childPeriod: 'minute',
    periodIntervals: [1, 7], // 1 day, 1 week
  },
  minute: {
    format: 'HH:mm',
    parentPeriod: 'day',
    periodIntervals: [1, 5, 15, 60, 180, 360], // 1min, 5min, 15min, 1h, 3h, 6h
  },
};

// A linear mapping [a, b] -> [0, 1] (maps value x=a into 0 and x=b into 1).
function linearGradientValue(x, [a, b]) {
  return (x - a) / (b - a);
}

// TODO: Tidy up this component.
class TimelinePeriodLabels extends React.PureComponent {
  findOptimalDurationFit(period, { durationMsPerPixel }) {
    const minimalDurationMs = durationMsPerPixel * 1.1 * MIN_TICK_SPACING_PX;
    return find(
      TICK_SETTINGS_PER_PERIOD[period].periodIntervals,
      p => moment.duration(p, period).asMilliseconds() >= minimalDurationMs
    );
  }

  getTicksForPeriod(period, timelineTransform) {
    // First find the optimal duration between the ticks - if no satisfactory
    // duration could be found, don't render any ticks for the given period.
    const { parentPeriod } = TICK_SETTINGS_PER_PERIOD[period];
    const periodInterval = this.findOptimalDurationFit(
      period,
      timelineTransform
    );
    if (!periodInterval) return [];

    // Get the boundary values for the displayed part of the timeline.
    const halfWidth = this.props.width / 2;
    const timeScale = getTimeScale(timelineTransform);
    const momentStart = moment(timeScale.invert(-halfWidth)).utc();
    const momentEnd = moment(timeScale.invert(halfWidth)).utc();

    // Start counting the timestamps from the most recent timestamp that is not shown
    // on screen. The values are always rounded up to the timestamps of the next bigger
    // period (e.g. for days it would be months, for months it would be years).
    let momentTimestamp = moment(momentStart)
      .utc()
      .startOf(parentPeriod || period);
    while (momentTimestamp.isBefore(momentStart)) {
      momentTimestamp = moment(momentTimestamp).add(periodInterval, period);
    }
    momentTimestamp = moment(momentTimestamp).subtract(periodInterval, period);

    // Make that hidden timestamp the first one in the list, but position
    // it inside the visible range with a prepended arrow to the past.
    const ticks = [
      {
        timestamp: formattedTimestamp(momentTimestamp),
        position: -halfWidth,
        isBehind: true,
      },
    ];

    // Continue adding ticks till the end of the visible range.
    do {
      // If the new timestamp enters into a new bigger period, we round it down to the
      // beginning of that period. E.g. instead of going [Jan 22nd, Jan 29th, Feb 5th],
      // we output [Jan 22nd, Jan 29th, Feb 1st]. Right now this case only happens between
      // days and months, but in theory it could happen whenever bigger periods are not
      // divisible by the duration we are using as a step between the ticks.
      let newTimestamp = moment(momentTimestamp).add(periodInterval, period);
      if (
        parentPeriod &&
        newTimestamp.get(parentPeriod) !== momentTimestamp.get(parentPeriod)
      ) {
        newTimestamp = moment(newTimestamp)
          .utc()
          .startOf(parentPeriod);
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
      const parentInterval =
        TICK_SETTINGS_PER_PERIOD[parentPeriod].periodIntervals[0];
      const parentIntervalMs = moment
        .duration(parentInterval, parentPeriod)
        .asMilliseconds();
      const fadedInDurationMs = parentIntervalMs * durationMultiplier;
      const fadedOutDurationMs = fadedInDurationMs * FADE_OUT_FACTOR;

      const transitionFactor =
        Math.log(fadedOutDurationMs) - Math.log(durationMsPerPixel);
      const transitionLength =
        Math.log(fadedOutDurationMs) - Math.log(fadedInDurationMs);

      shift = clamp(transitionFactor / transitionLength, 0, 1);
    }

    if (childPeriod) {
      shift += this.getVerticalShiftForPeriod(childPeriod, {
        durationMsPerPixel,
      });
    }

    return shift;
  }

  isOutsideOfClickableRange(timestamp) {
    const { clickableStartAt, clickableEndAt } = this.props;
    const beforeClickableStartAt =
      clickableStartAt && clickableStartAt > timestamp;
    const afterClickableEndtAt = clickableEndAt && clickableEndAt < timestamp;
    return beforeClickableStartAt || afterClickableEndtAt;
  }

  render() {
    const { period } = this.props;
    const periodFormat = TICK_SETTINGS_PER_PERIOD[period].format;
    const ticks = this.getTicksForPeriod(period, this.props);

    const ticksRow =
      MAX_TICK_ROWS - this.getVerticalShiftForPeriod(period, this.props);
    const transform = `translate(0, ${ticksRow * TICKS_ROW_SPACING})`;

    // Ticks quickly fade in from the bottom and then slowly start
    // fading out towards the top until they are pushed out of canvas.
    const focusedRow = MAX_TICK_ROWS - 1;
    const opacity =
      ticksRow > focusedRow
        ? linearGradientValue(ticksRow, [MAX_TICK_ROWS, focusedRow])
        : linearGradientValue(ticksRow, [-2, focusedRow]);
    const isBarelyVisible = opacity < 0.4;

    return (
      <g className={period} transform={transform} style={{ opacity }}>
        {map(ticks, ({ timestamp, position, isBehind }) => (
          <TimelineLabel
            key={timestamp}
            timestamp={timestamp}
            position={position}
            isBehind={isBehind}
            periodFormat={periodFormat}
            disabled={
              isBarelyVisible || this.isOutsideOfClickableRange(timestamp)
            }
            onClick={this.props.onClick}
          />
        ))}
      </g>
    );
  }
}

TimelinePeriodLabels.propTypes = {
  period: PropTypes.string.isRequired,
  focusedTimestamp: PropTypes.string.isRequired,
  durationMsPerPixel: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  clickableStartAt: PropTypes.string.isRequired,
  clickableEndAt: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TimelinePeriodLabels;
