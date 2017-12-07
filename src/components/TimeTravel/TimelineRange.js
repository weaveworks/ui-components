import React from 'react';
import moment from 'moment';

import { getTimeScale } from '../../utils/timeline';
import { MIN_RANGE_INTERVAL_PX } from '../../constants/timeline';


const TimelineInterval =
({ color, focusedTimestamp, durationMsPerPixel, startAt, endAt, width, height }) => {
  const timeScale = getTimeScale({ focusedTimestamp, durationMsPerPixel });
  const endShift = endAt ? timeScale(moment(endAt)) : width;
  let startShift = startAt ? timeScale(moment(startAt)) : -width;

  // If the range interval is very short or we're zoomed out a lot, render the
  // interval as at least MIN_RANGE_INTERVAL_PX pixels wide. Then re-adjust the left
  // and of the interval to account for the calibrated min-width.
  const length = Math.max(MIN_RANGE_INTERVAL_PX, endShift - startShift);
  startShift = endShift - length;

  return (
    <rect
      fill={color} fillOpacity="0.15"
      transform={`translate(${startShift}, 0)`}
      width={length} height={height}
    />
  );
};

export default TimelineInterval;
