import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { spacing } from '../../theme/selectors';

const PanButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.purple400};
  font-size: ${props => props.theme.fontSizes.small};
  cursor: pointer;
  pointer-events: all;
  padding: ${spacing('xxs')} 0;
  margin: 0 ${spacing('xxs')};
  width: 20px;
  outline: 0;
  border: 0;

  /* Remove outline on Firefox */
  &::-moz-focus-inner {
    border: 0;
  }
  &:focus {
    outline: none;
  }

  &:hover {
    color: ${props => props.theme.colors.purple900};
  }
`;

// TODO: Consider making this action sticky-transition to live mode as well.
class TimelinePanButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { timeScale, movePixels } = this.props;
    const momentTimestamp = timeScale.invert(movePixels);
    this.props.onClick(momentTimestamp);
  }

  render() {
    return (
      <PanButton onClick={this.handleClick}>
        <span className={this.props.icon} />
      </PanButton>
    );
  }
}

TimelinePanButton.propTypes = {
  icon: PropTypes.string.isRequired,
  movePixels: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
};

export default TimelinePanButton;
