import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TimelineLabelWrapper = styled.span.attrs({
  style: ({ left }) => ({ left }),
})`
  position: absolute;
`;

const TimelineLabelContainer = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary.lavender};
  cursor: pointer;
  font-size: 13px;
  margin-left: 2px;
  padding: 3px;
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

const TimelineLabelLine = styled.span`
  border-left: 1px solid ${props => props.theme.colors.alto};
  position: absolute;
  height: 75px;
`;

class TimelineLabel extends React.Component {
  handleClick = () => {
    if (!this.props.disabled) {
      this.props.onClick(this.props.timestamp);
    }
  };

  getTitle = () => {
    if (this.props.disabled) return '';

    return `Jump to ${this.props.timestamp}`;
  };

  render() {
    const {
      periodFormat,
      timestamp,
      position,
      isBehind,
      disabled,
    } = this.props;

    return (
      <TimelineLabelWrapper left={position} title={this.getTitle()}>
        {!isBehind && <TimelineLabelLine />}
        <TimelineLabelContainer onClick={this.handleClick} disabled={disabled}>
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
