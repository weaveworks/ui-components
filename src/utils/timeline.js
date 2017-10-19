import moment from 'moment';
import { find } from 'lodash';

import { scaleUtc } from 'd3-scale';
import { scaleDuration } from './time';

import { MIN_TICK_SPACING_PX } from '../constants/timeline';


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
