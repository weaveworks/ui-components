import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const TimestampInputWrapper = styled.div`
  font-size: 13px;
  align-items: baseline;
  padding: 3px 8px;
  pointer-events: all;
  opacity: 0.8;
  display: flex;
`;

const TimestampInputContainer = styled.input`
  background-color: transparent;
  font-family: "Roboto", sans-serif;
  margin-right: 3px;
  text-align: center;
  font-size: 1rem;
  width: 165px;
  border: 0;
  outline: 0;
`;

class TimestampInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      timestamp: props.timestamp,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { timestamp } = nextProps;
    if (timestamp !== this.props.timestamp) {
      this.setState({ timestamp });
    }
  }

  handleChange(ev) {
    const timestamp = ev.target.value;
    this.setState({ timestamp });

    if (moment(timestamp).isValid()) {
      this.props.onChangeTimestamp(timestamp);
    }
  }

  render() {
    return (
      <TimestampInputWrapper>
        <TimestampInputContainer
          value={this.state.timestamp}
          onChange={this.handleChange}
          disabled={this.props.disabled}
        /> UTC
      </TimestampInputWrapper>
    );
  }
}

TimestampInput.propTypes = {
  timestamp: PropTypes.string,
  onChangeTimestamp: PropTypes.func,
  disabled: PropTypes.bool,
};

export default TimestampInput;
