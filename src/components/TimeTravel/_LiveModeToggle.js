import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const LiveModeToggleWrapper = styled.div`
  display: flex;
`;

const ToggleButton = styled.button`
  border: 0;
  background-color: transparent;
  border-right: 1px solid ${props => props.theme.colors.neutral.lightgray};
  color: ${props => props.theme.colors.primary.charcoal};
  font-size: 14px;
  padding: 2px 8px;
  pointer-events: all;
  outline: 0;
  cursor: pointer;

  // Remove outline on Firefox
  &::-moz-focus-inner { border: 0; }
  &:focus { outline: none; }

  ${props => props.disabled && `
    box-shadow: inset 1px 1px 6px ${props.theme.colors.neutral.lightgray};
    color: ${props.theme.colors.gray};
    opacity: 0.75;
  `}
`;

class LiveModeToggle extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showingLive: props.showingLive,
    };

    this.handleLiveClick = this.handleLiveClick.bind(this);
    this.handlePausedClick = this.handlePausedClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { showingLive } = nextProps;
    if (showingLive !== this.props.showingLive) {
      this.setState({ showingLive });
    }
  }

  handleLiveClick() {
    this.setState({ showingLive: true });
    this.props.onToggle(true);
  }

  handlePausedClick() {
    this.setState({ showingLive: false });
    this.props.onToggle(false);
  }

  render() {
    return (
      <LiveModeToggleWrapper>
        <ToggleButton onClick={this.handleLiveClick} disabled={this.state.showingLive}>
          <span className="fa fa-play" />
        </ToggleButton>
        <ToggleButton onClick={this.handlePausedClick} disabled={!this.state.showingLive}>
          <span className="fa fa-pause" />
        </ToggleButton>
      </LiveModeToggleWrapper>
    );
  }
}

LiveModeToggle.propTypes = {
  showingLive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default LiveModeToggle;
