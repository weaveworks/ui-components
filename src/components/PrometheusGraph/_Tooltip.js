import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const TooltipContainer = styled.div.attrs({
  // Using attrs prevents extensive styled components
  // generation every time the tooltip is repositioned.
  style: ({ x, y }) => ({ left: x, top: y }),
})`
  background-color: ${props => props.theme.colors.lightgray};
  border: 1px solid ${props => props.theme.colors.neutral.lightgray};
  border-radius: 4px;
  padding: 10px 15px;
  color: #555;
  position: absolute;
  margin-top: 20px;
  margin-left: 10px;
  pointer-events: none;
  min-width: 250px;
  max-width: 500px;
  opacity: 0.95;
  z-index: 5;
`;

const Timestamp = styled.div`
  font-size: 13px;
  margin-bottom: 5px;
`;

class Tooltip extends React.PureComponent {
  saveTooltipRef = (ref) => {
    this.tooltipRef = ref;
  }

  getTooltipBoundingRect() {
    return this.tooltipRef
      ? this.tooltipRef.getBoundingClientRect()
      : { width: 0, height: 0, top: 0, left: 0 };
  }

  render() {
    const { x, y, humanizedTimestamp, graphWidth } = this.props;
    const tooltipWidth = this.getTooltipBoundingRect().width;
    const clampedX = Math.min(x, graphWidth - tooltipWidth - 10);

    return (
      <TooltipContainer x={clampedX} y={y} innerRef={this.saveTooltipRef}>
        <Timestamp>{humanizedTimestamp}</Timestamp>
        {this.props.children}
      </TooltipContainer>
    );
  }
}

Tooltip.propTypes = {
  graphWidth: PropTypes.number.isRequired,
  humanizedTimestamp: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default Tooltip;
