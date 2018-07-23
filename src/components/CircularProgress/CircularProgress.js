import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { transparentize } from 'polished';

import theme from '../../theme';

const charcoal100 = theme.colors.purple900;
const charcoal70 = transparentize(0.3, charcoal100);
const charcoal50 = transparentize(0.5, charcoal100);
const charcoal20 = transparentize(0.8, charcoal100);

const dotSpinnerAnimation = keyframes`
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal100}, 1.8em -1.8em 0 0em ${charcoal20}, 2.5em 0em 0 0em ${charcoal20}, 1.75em 1.75em 0 0em ${charcoal20}, 0em 2.5em 0 0em ${charcoal20}, -1.8em 1.8em 0 0em ${charcoal20}, -2.6em 0em 0 0em ${charcoal50}, -1.8em -1.8em 0 0em ${charcoal70};
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal70}, 1.8em -1.8em 0 0em ${charcoal100}, 2.5em 0em 0 0em ${charcoal20}, 1.75em 1.75em 0 0em ${charcoal20}, 0em 2.5em 0 0em ${charcoal20}, -1.8em 1.8em 0 0em ${charcoal20}, -2.6em 0em 0 0em ${charcoal20}, -1.8em -1.8em 0 0em ${charcoal50};
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal50}, 1.8em -1.8em 0 0em ${charcoal70}, 2.5em 0em 0 0em ${charcoal100}, 1.75em 1.75em 0 0em ${charcoal20}, 0em 2.5em 0 0em ${charcoal20}, -1.8em 1.8em 0 0em ${charcoal20}, -2.6em 0em 0 0em ${charcoal20}, -1.8em -1.8em 0 0em ${charcoal20};
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal20}, 1.8em -1.8em 0 0em ${charcoal50}, 2.5em 0em 0 0em ${charcoal70}, 1.75em 1.75em 0 0em ${charcoal100}, 0em 2.5em 0 0em ${charcoal20}, -1.8em 1.8em 0 0em ${charcoal20}, -2.6em 0em 0 0em ${charcoal20}, -1.8em -1.8em 0 0em ${charcoal20};
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal20}, 1.8em -1.8em 0 0em ${charcoal20}, 2.5em 0em 0 0em ${charcoal50}, 1.75em 1.75em 0 0em ${charcoal70}, 0em 2.5em 0 0em ${charcoal100}, -1.8em 1.8em 0 0em ${charcoal20}, -2.6em 0em 0 0em ${charcoal20}, -1.8em -1.8em 0 0em ${charcoal20};
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal20}, 1.8em -1.8em 0 0em ${charcoal20}, 2.5em 0em 0 0em ${charcoal20}, 1.75em 1.75em 0 0em ${charcoal50}, 0em 2.5em 0 0em ${charcoal70}, -1.8em 1.8em 0 0em ${charcoal100}, -2.6em 0em 0 0em ${charcoal20}, -1.8em -1.8em 0 0em ${charcoal20};
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal20}, 1.8em -1.8em 0 0em ${charcoal20}, 2.5em 0em 0 0em ${charcoal20}, 1.75em 1.75em 0 0em ${charcoal20}, 0em 2.5em 0 0em ${charcoal50}, -1.8em 1.8em 0 0em ${charcoal70}, -2.6em 0em 0 0em ${charcoal100}, -1.8em -1.8em 0 0em ${charcoal20};
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em ${charcoal20}, 1.8em -1.8em 0 0em ${charcoal20}, 2.5em 0em 0 0em ${charcoal20}, 1.75em 1.75em 0 0em ${charcoal20}, 0em 2.5em 0 0em ${charcoal20}, -1.8em 1.8em 0 0em ${charcoal50}, -2.6em 0em 0 0em ${charcoal70}, -1.8em -1.8em 0 0em ${charcoal100};
  }
`;

const DotSpinner = styled.div`
  border-radius: ${props => props.theme.borderRadius.circle};
  position: relative;
  text-indent: -9999em;
  -webkit-animation: ${dotSpinnerAnimation} 1.1s infinite ease;
  animation: ${dotSpinnerAnimation} 1.1s infinite ease;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);

  ${props =>
    props.scale &&
    `
    margin: ${15 * props.scale}px;
    font-size: ${5 * props.scale}px;
    width: ${5 * props.scale}px;
    height: ${5 * props.scale}px;
  `};
`;

const ProgressContainer = styled.div`
  display: inline-block;
`;

const ProgressWrapper = styled.div`
  width: ${props => props.size}px;
  height: ${props => props.size}px;

  ${props =>
    props.inline &&
    `
    display: inline-block;
    vertical-align: middle;
  `};
  ${props =>
    props.center &&
    `
    margin-left: auto;
    margin-right: auto;
  `};
`;

/**
 * Size is set in px
 * ```javascript
 * import React from 'react';
 * import { CircularProgress } from 'weaveworks-ui-components'
 *
 * React.render(
 *   <div>
 *     <CircularProgress size={35} />
 *     <CircularProgress inline /> Inline
 *     <CircularProgress center />
 *   </div>
 * );
 * ```
 */
const CircularProgress = props => (
  <ProgressWrapper {...props}>
    <ProgressContainer>
      <DotSpinner scale={props.size / 35} />
    </ProgressContainer>
  </ProgressWrapper>
);

CircularProgress.propTypes = {
  /** Size of spinner in px */
  size: PropTypes.number,
  /** Whether to display the spinner inline */
  inline: PropTypes.bool,
  /** Whether to center the spinner horizontally */
  center: PropTypes.bool,
};

CircularProgress.defaultProps = {
  size: 30,
  inline: false,
  center: false,
};

export default CircularProgress;
