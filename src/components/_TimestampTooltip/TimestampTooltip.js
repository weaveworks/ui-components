import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TimestampTag from '../TimestampTag';

const TooltipContainer = styled.div.attrs({
  // Using attrs prevents extensive styled components
  // generation every time the tooltip is repositioned.
  style: ({ x, y }) => ({ left: x, top: y }),
})`
  color: ${props => props.theme.colors.primary.charcoal};
  background-color: ${props => props.theme.colors.lightgray};
  border: 1px solid ${props => props.theme.colors.silverDark};
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
`;

const TimestampWrapper = styled.div`
  margin-bottom: 8px;
`;

class TimestampTooltip extends React.PureComponent {
  saveTooltipRef = ref => {
    this.tooltipRef = ref;
  };

  getTooltipBoundingRect() {
    return this.tooltipRef
      ? this.tooltipRef.getBoundingClientRect()
      : { width: 0, height: 0, top: 0, left: 0 };
  }

  render() {
    const { x, y, timestamp, graphWidth } = this.props;
    const tooltipWidth = this.getTooltipBoundingRect().width;
    const clampedX = Math.min(x, graphWidth - tooltipWidth - 10);

    return (
      <TooltipContainer x={clampedX} y={y} innerRef={this.saveTooltipRef}>
        <TimestampWrapper>
          <TimestampTag timestamp={timestamp} />
        </TimestampWrapper>
        {this.props.children}
      </TooltipContainer>
    );
  }
}

TimestampTooltip.propTypes = {
  graphWidth: PropTypes.number.isRequired,
  timestamp: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default TimestampTooltip;
