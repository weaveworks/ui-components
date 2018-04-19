import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

class TimelineLabel extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
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
      <g transform={`translate(${position}, 0)`}>
        {!isBehind && <line y2="75" stroke="#ddd" strokeWidth="1" />}
        {!disabled && <title>Jump to {timestamp}</title>}
        <foreignObject width="100" height="20" style={{ lineHeight: '20px' }}>
          <TimelineLabelContainer
            onClick={this.handleClick}
            disabled={disabled}
          >
            {moment(timestamp)
              .utc()
              .format(periodFormat)}
          </TimelineLabelContainer>
        </foreignObject>
      </g>
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
