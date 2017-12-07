import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const PanButton = styled.button`
  background-color: transparent;
  color: ${props => props.theme.colors.primary.lavender};
  cursor: pointer;
  font-size: 13px;
  pointer-events: all;
  padding: 5px 0;
  margin: 0 5px;
  width: 20px;
  outline: 0;
  border: 0;

  &:hover {
    color: ${props => props.theme.colors.primary.charcoal};
  }
`;

// TODO: Consider making this action sticky-transition to live mode as well.
class TimelinePanButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { durationMsPerPixel, movePixels, focusedTimestamp } = this.props;
    const momentTimestamp = moment(focusedTimestamp).add(durationMsPerPixel * movePixels);
    this.props.onClick(momentTimestamp.utc().format());
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
  focusedTimestamp: PropTypes.string.isRequired,
  durationMsPerPixel: PropTypes.number.isRequired,
  movePixels: PropTypes.number.isRequired,
  icon: PropTypes.string.isRequired,
};

export default TimelinePanButton;
