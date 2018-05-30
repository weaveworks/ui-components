import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TimelineLabelWrapper = styled.span.attrs({
  style: ({ position }) => ({ transform: `translateX(${position}px)` })
})`
  position: absolute;
`;

const TimelineLabelLine = styled.span`
  border-left: 1px solid ${props => props.theme.colors.alto};
  height: 75px;
`;

const TimelineLabelContainer = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary.lavender};
  font-size: ${props => props.theme.fontSizes.small};
  cursor: pointer;
  margin-left: 2px;
  padding: 0 1px;
  outline: 0;
  border: 0;

  /* Remove outline on Firefox */
  &::-moz-focus-inner {
    border: 0;
  }
  &:focus {
    outline: none;
  }

  &[disabled] {
    color: ${props => props.theme.colors.gray};
    cursor: inherit;
  }

  &:not([disabled]):hover {
    color: ${props => props.theme.colors.primary.charcoal};
  }
`;

class TimelineLabel extends React.Component {
  handleClick = () => {
    if (!this.props.disabled) {
      this.props.onClick(this.props.timestamp);
    }
  }

  render() {
    const {
      periodFormat,
      timestamp,
      position,
      isBehind,
      disabled,
    } = this.props;

    return (
      <TimelineLabelWrapper position={position}>
        {!isBehind && <TimelineLabelLine />}
        <TimelineLabelContainer
          onClick={this.handleClick}
          title={disabled ? '' : `Jump to ${timestamp}`}
          disabled={disabled}
        >
          {moment(timestamp)
            .utc()
            .format(periodFormat)}
        </TimelineLabelContainer>
      </TimelineLabelWrapper>
    );
  }
}

TimelineLabel.propTypes = {
  periodFormat: PropTypes.string.isRequired,
  timestamp: PropTypes.string.isRequired,
  position: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isBehind: PropTypes.bool,
};

export default TimelineLabel;
