import moment from 'moment';
import { find } from 'lodash';

import { scaleUtc } from 'd3-scale';
import { scaleDuration, clampDuration, nowInSecondsPrecision } from './time';

import { MIN_TICK_SPACING_PX } from '../constants/timeline';


function availableTimelineDuration(earliestTimestamp) {
  return moment.duration(nowInSecondsPrecision().diff(earliestTimestamp));
}

// The most granular zoom is 4px per second, probably we don't want any more granular than that.
export function minDurationPerTimelinePx() {
  return moment.duration(250, 'milliseconds');
}

// Maximum level we can zoom out is such that the available range takes 400px. The 3 days
// per pixel upper bound on that scale is to prevent ugly rendering in extreme cases.
export function maxDurationPerTimelinePx(earliestTimestamp) {
  const duration = scaleDuration(availableTimelineDuration(earliestTimestamp), 1 / 400);
  const clampInterval = [minDurationPerTimelinePx(), moment.duration(3, 'days')];
  return clampDuration(duration, clampInterval);
}

// The initial zoom level is set to be 10% of the max zoom out level capped at 1px per minute,
// with the assumption that if we have a long recorded history, we're in most cases by
// default going to be interested in what happened in last couple of hours or so.
export function initialDurationPerTimelinePx(earliestTimestamp) {
  const duration = scaleDuration(maxDurationPerTimelinePx(earliestTimestamp), 1 / 10);
  const clampInterval = [minDurationPerTimelinePx(), moment.duration(1, 'minute')];
  return clampDuration(duration, clampInterval);
}

export function getTimeScale({ focusedTimestamp, durationPerPixel }) {
  const roundedTimestamp = moment(focusedTimestamp).utc().startOf('second');
  const startDate = moment(roundedTimestamp).subtract(durationPerPixel);
  const endDate = moment(roundedTimestamp).add(durationPerPixel);
  return scaleUtc()
    .domain([startDate, endDate])
    .range([-1, 1]);
}

export function findOptimalDurationFit(durations, { durationPerPixel }) {
  const minimalDuration = scaleDuration(durationPerPixel, 1.1 * MIN_TICK_SPACING_PX);
  return find(durations, d => d >= minimalDuration);
}

export function timestampToInputValue(timestamp) {
  return (timestamp ? moment(timestamp) : moment()).utc().format();
}
