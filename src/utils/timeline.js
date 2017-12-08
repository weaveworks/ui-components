import moment from 'moment';
import { scaleUtc } from 'd3-scale';


export function formattedTimestamp(timestamp) {
  const momentTimestamp = timestamp ? moment(timestamp) : moment();
  return momentTimestamp.startOf('second').utc().format();
}

export function getTimeScale({ focusedTimestamp, durationMsPerPixel }) {
  const startDate = moment(focusedTimestamp).subtract(durationMsPerPixel);
  const endDate = moment(focusedTimestamp).add(durationMsPerPixel);
  return scaleUtc()
    .domain([startDate, endDate])
    .range([-1, 1]);
}
