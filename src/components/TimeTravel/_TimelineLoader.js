import React from 'react';
import moment from 'moment';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

// NOTE (fbarl): For some reason, doing the animation with
// opacity looks buggy on my Chrome on deep zoom levels.
/* stylelint-disable color-no-hex */
const blinking = keyframes`
  0% {
    background-color: transparent;
  }
  50% {
    background-color: #fff;
  }
  100% {
    background-color: transparent;
  }
`;
/* stylelint-enable color-no-hex */

const TimelineLoaderOverlay = styled.div.attrs({
  style: ({ x, width }) => ({
    left: `${x}px`,
    width,
  }),
})`
  animation: ${blinking} 2s linear infinite;
  pointer-events: none;
  position: absolute;
  opacity: 0.65;
  height: 100%;
`;

const TimelineLoader = ({ timeScale, startAt, endAt, width }) => {
  const endShift = endAt ? Math.min(timeScale(moment(endAt)), width) : width;
  const startShift = startAt
    ? Math.max(timeScale(moment(startAt)), -width)
    : -width;
  const length = endShift - startShift;

  return <TimelineLoaderOverlay x={startShift} width={length} />;
};

TimelineLoader.propTypes = {
  timeScale: PropTypes.func.isRequired,
  startAt: PropTypes.string,
  endAt: PropTypes.string,
  width: PropTypes.number.isRequired,
};

TimelineLoader.defaultProps = {
  endAt: '',
  startAt: '',
};

export default TimelineLoader;
