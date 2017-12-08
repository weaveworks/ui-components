import moment from 'moment';
import { clamp } from 'lodash';
import { scaleUtc } from 'd3-scale';


export function formattedTimestamp(timestamp) {
  const momentTimestamp = timestamp ? moment(timestamp) : moment();
  return momentTimestamp.startOf('second').utc().format();
}

function availableTimelineDurationMs(earliestTimestamp) {
  const earliestMomentTimestamp = moment(earliestTimestamp);
  const currentMomentTimestamp = moment(formattedTimestamp());
  return currentMomentTimestamp.diff(earliestMomentTimestamp);
}

// The most granular zoom is 2px per second, probably we don't want any more granular than that.
export function minDurationMsPerTimelinePx() {
  return moment.duration(500, 'milliseconds').asMilliseconds();
}

// Maximum level we can zoom out is such that the available range takes 400px. The 3 days
// per pixel upper bound on that scale is to prevent ugly rendering in extreme cases.
export function maxDurationMsPerTimelinePx(earliestTimestamp) {
  const durationMsLowerBound = minDurationMsPerTimelinePx();
  const durationMsUpperBound = moment.duration(3, 'days').asMilliseconds();
  const durationMs = availableTimelineDurationMs(earliestTimestamp) / 400.0;
  return clamp(durationMs, durationMsLowerBound, durationMsUpperBound);
}

// The initial zoom level is set to be 10% of the max zoom out level capped at 1px per minute,
// with the assumption that if we have a long recorded history, we're in most cases by
// default going to be interested in what happened in last couple of hours or so.
export function initialDurationMsPerTimelinePx(earliestTimestamp) {
  const durationMsLowerBound = minDurationMsPerTimelinePx();
  const durationMsUpperBound = moment.duration(1, 'minute').asMilliseconds();
  const durationMs = maxDurationMsPerTimelinePx(earliestTimestamp) * 0.1;
  return clamp(durationMs, durationMsLowerBound, durationMsUpperBound);
}

export function getTimeScale({ focusedTimestamp, durationMsPerPixel }) {
  const startDate = moment(focusedTimestamp).subtract(durationMsPerPixel);
  const endDate = moment(focusedTimestamp).add(durationMsPerPixel);
  return scaleUtc()
    .domain([startDate, endDate])
    .range([-1, 1]);
}
