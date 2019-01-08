import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AutosizeInput from 'react-input-autosize';

import { spacing } from '../../theme/selectors';

const TimestampInputWrapper = styled.div`
  font-size: ${props => props.theme.fontSizes.small};
  align-items: baseline;
  padding: ${spacing('xxs')} ${spacing('xs')};
  pointer-events: all;
  opacity: 0.8;
  display: flex;
`;

const TimestampInputContainer = styled(AutosizeInput)`
  input {
    font-size: ${props => props.theme.fontSizes.normal};
    font-family: ${props => props.theme.fontFamilies.monospace};
    background-color: transparent;
    margin-right: ${spacing('xxs')};
    text-align: left;
    min-width: 195px;
    max-width: 300px;
    border: 0;
    outline: 0;
  }

  /* See https://github.com/JedWatson/react-input-autosize/issues/135 */
  div {
    overflow: hidden !important;
  }
`;

class TimestampInput extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      timestamp: props.timestamp,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submit = this.submit.bind(this);
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
  }

  handleKeyDown(ev) {
    if (ev.keyCode === 13) {
      this.submit();
    }
  }

  submit() {
    const { timestamp } = this.state;
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
          onBlur={this.submit}
          onKeyDown={this.handleKeyDown}
          disabled={this.props.disabled}
        />{' '}
        UTC
      </TimestampInputWrapper>
    );
  }
}

TimestampInput.propTypes = {
  disabled: PropTypes.bool,
  onChangeTimestamp: PropTypes.func.isRequired,
  timestamp: PropTypes.string.isRequired,
};

TimestampInput.defaultProps = {
  disabled: false,
};

export default TimestampInput;
