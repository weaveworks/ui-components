import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const TimelineRangeOverlay = styled.div.attrs({
  style: ({ position }) => ({ transform: `translateX(${position}px)`})
})`
  background-color: ${props => props.color};
  height: ${props => props.height}px;
  width: ${props => props.width}px;
  position: absolute;
  opacity: 0.15;
`;

const TimelineRange = ({ color, timeScale, startAt, endAt, width, height }) => {
  const endShift = endAt ? timeScale(moment(endAt)) : width;
  let startShift = startAt ? timeScale(moment(startAt)) : -width;

  // If the range interval is very short or we're zoomed out a lot, render the
  // interval as at least 4 pixels wide. Then re-adjust the left end of the
  // interval to account for the calibrated min-width.
  const length = Math.max(4, endShift - startShift);
  startShift = endShift - length;

  return (
    <TimelineRangeOverlay color={color} position={startShift} width={length} height={height} />
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
