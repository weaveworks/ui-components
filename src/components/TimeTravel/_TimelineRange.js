import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MAX_WIDTH = 100000;

const TimelineRangeShadow = styled.div.attrs({
  style: ({ start, end }) => ({
    width: end - start,
    left: start,
  }),
})`
  background-color: ${props => props.color};
  position: absolute;
  opacity: 0.15;
  height: 100%;
`;

const TimelineRange = ({ color, timeScale, startAt, endAt }) => {
  const endShift = endAt ? timeScale(moment(endAt)) : MAX_WIDTH;
  let startShift = startAt ? timeScale(moment(startAt)) : -MAX_WIDTH;

  // If the range interval is very short or we're zoomed out a lot, render the
  // interval as at least 4 pixels wide. Then re-adjust the left end of the
  // interval to account for the calibrated min-width.
  const length = Math.max(4, endShift - startShift);
  startShift = endShift - length;

  return (
    <TimelineRangeShadow color={color} start={startShift} end={endShift} />
  );
};

TimelineRange.propTypes = {
  color: PropTypes.string.isRequired,
  timeScale: PropTypes.func.isRequired,
  startAt: PropTypes.string,
  endAt: PropTypes.string,
};

export default TimelineRange;
