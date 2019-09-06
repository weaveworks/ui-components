import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TimestampTag from '../TimestampTag';

const TooltipContainer = styled.div.attrs(({ offsetX, offsetY }) => ({
  // Using attrs prevents extensive styled components
  // generation every time the tooltip is repositioned.
  style: { left: offsetX, top: offsetY },
}))`
  color: ${props => props.theme.colors.purple900};
  background-color: ${props => props.theme.colors.gray50};
  border: 1px solid ${props => props.theme.colors.gray200};
  border-radius: ${props => props.theme.borderRadius.soft};
  z-index: ${props => props.theme.layers.tooltip};
  padding: 10px 15px;
  position: absolute;
  margin-top: 20px;
  margin-left: 10px;
  pointer-events: none;
  min-width: 250px;
  max-width: 500px;
  opacity: 0.95;

  ${props => !props.visible && 'opacity: 0;'};
`;

const TimestampWrapper = styled.div`
  margin-bottom: 8px;
`;

class TimestampTooltip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      prerendered: false,
    };
  }

  saveTooltipRef = ref => {
    this.tooltipRef = ref;
  };

  componentDidMount() {
    // HACK: We wait for the first render to finish to get the accurate width
    // of the tooltip for calculating its position, keeping the tooltip invisible
    // through the first render cycle. After the first render has finished,
    // we set a 'prerender' flag to true force second render which actually
    // displays the tooltip. This is to prevent tooltip flickering before
    // we get its proper size.
    setTimeout(() => {
      this.setState({ prerendered: true });
    }, 0);
  }

  getTooltipBoundingRect() {
    return this.tooltipRef
      ? this.tooltipRef.getBoundingClientRect()
      : {
          height: 0,
          left: 0,
          top: 0,
          width: 0,
        };
  }

  render() {
    const { width } = this.getTooltipBoundingRect();
    const { offsetX, offsetY, timestamp, containerWidth } = this.props;
    const clampedX = Math.min(offsetX, containerWidth - width - 10);

    return (
      <TooltipContainer
        offsetX={clampedX}
        offsetY={offsetY}
        visible={this.state.prerendered}
        ref={this.saveTooltipRef}
      >
        <TimestampWrapper>
          <TimestampTag timestamp={timestamp} />
        </TimestampWrapper>
        {this.props.children}
      </TooltipContainer>
    );
  }
}

TimestampTooltip.propTypes = {
  containerWidth: PropTypes.number.isRequired,
  offsetX: PropTypes.number,
  offsetY: PropTypes.number,
  timestamp: PropTypes.string.isRequired,
};

TimestampTooltip.defaultProps = {
  offsetX: 0,
  offsetY: 0,
};

export default TimestampTooltip;
