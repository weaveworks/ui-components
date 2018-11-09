import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const LiveModeToggleWrapper = styled.div`
  display: flex;
`;

const ToggleButton = styled.button`
  border: 0;
  background-color: transparent;
  border-right: 1px solid ${props => props.theme.colors.gray200};
  color: ${props => props.theme.colors.purple900};
  pointer-events: all;
  outline: 0;
  cursor: pointer;

  /* Remove outline on Firefox */
  &::-moz-focus-inner {
    border: 0;
  }
  &:focus {
    outline: none;
  }

  ${props =>
    props.pressed &&
    `
    box-shadow: inset 1px 1px 6px ${props.theme.colors.gray200};
    color: ${props.theme.colors.gray600};
    opacity: 0.75;
  `};
`;

class LiveModeToggle extends React.PureComponent {
  constructor(props, context) {
    super(props, context);

    this.state = {
      showingLive: props.showingLive,
    };

    this.handleToggle = this.handleToggle.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { showingLive } = nextProps;
    if (showingLive !== this.props.showingLive) {
      this.setState({ showingLive });
    }
  }

  handleToggle() {
    const showingLive = !this.state.showingLive;
    this.setState({ showingLive });
    this.props.onToggle(showingLive);
  }

  render() {
    return (
      <LiveModeToggleWrapper>
        <ToggleButton
          onClick={this.handleToggle}
          pressed={this.state.showingLive}
        >
          <i className="fa fa-sm fa-fw fa-play" />
        </ToggleButton>
        <ToggleButton
          onClick={this.handleToggle}
          pressed={!this.state.showingLive}
        >
          <i className="fa fa-sm fa-fw fa-pause" />
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
