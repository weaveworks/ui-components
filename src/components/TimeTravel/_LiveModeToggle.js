import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const LiveModeToggleWrapper = styled.button`
  border: 0;
  background-color: transparent;
  border-right: 1px solid ${props => props.theme.colors.neutral.lightgray};
  color: ${props => props.theme.colors.primary.charcoal};
  font-family: "Roboto", sans-serif;
  font-size: 1rem;
  padding: 3px 8px;
  pointer-events: all;
  display: inline-block;
  text-align: center;
  min-width: 80px;
  outline: 0;
  cursor: pointer;

  // Remove outline on Firefox
  &::-moz-focus-inner { border: 0; }
  &:focus { outline: none; }

  @keyframes blinker {
    50% { opacity: 0.5; }
  }

  ${props => props.selected && `
    animation: blinker 1.5s linear infinite;
    background-color: rgba(143, 143, 215, 0.15);
  `}
`;

class LiveModeToggle extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showingLive: props.showingLive,
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { showingLive } = nextProps;
    if (showingLive !== this.props.showingLive) {
      this.setState({ showingLive });
    }
  }

  handleClick() {
    const showingLive = !this.state.showingLive;
    this.setState({ showingLive });
    this.props.onToggle(showingLive);
  }

  render() {
    return (
      <LiveModeToggleWrapper selected={!this.state.showingLive} onClick={this.handleClick}>
        {this.state.showingLive ? 'Live' : 'Paused'}
      </LiveModeToggleWrapper>
    );
  }
}

LiveModeToggle.propTypes = {
  showingLive: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default LiveModeToggle;
