import React from 'react';
import moment from 'moment';
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
    const durationMs = this.props.durationMsPerPixel * this.props.movePixels;
    const momentTimestamp = moment(this.props.focusedTimestamp).add(durationMs);
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

export default TimelinePanButton;
