import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

const TimelineRange = ({ color, timeScale, startAt, endAt, width, height }) => {
  const endShift = endAt ? timeScale(moment(endAt)) : width;
  let startShift = startAt ? timeScale(moment(startAt)) : -width;

  // If the range interval is very short or we're zoomed out a lot, render the
  // interval as at least 4 pixels wide. Then re-adjust the left end of the
  // interval to account for the calibrated min-width.
  const length = Math.max(4, endShift - startShift);
  startShift = endShift - length;

  return (
    <rect
      fill={color}
      fillOpacity={0.15}
      transform={`translate(${startShift}, 0)`}
      width={length}
      height={height}
    />
  );
};

TimelineRange.propTypes = {
  color: PropTypes.string.isRequired,
  timeScale: PropTypes.func.isRequired,
  startAt: PropTypes.string,
  endAt: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default TimelineRange;
