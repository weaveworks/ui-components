import React from 'react';
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
  margin-top: 35px;
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
  constructor(props, context) {
    super(props, context);

    this.saveTooltipRef = this.saveTooltipRef.bind(this);
  }

  saveTooltipRef(ref) {
    this.tooltipRef = ref;
  }

  getTooltipBoundingRect() {
    return this.tooltipRef
      ? this.tooltipRef.getBoundingClientRect()
      : { width: 0, height: 0, top: 0, left: 0 };
  }

  render() {
    const { x, y, timestamp, graphWidth } = this.props;
    const tooltipWidth = this.getTooltipBoundingRect().width;
    const clampedX = Math.min(x, graphWidth - tooltipWidth - 15);

    return (
      <TooltipContainer x={clampedX} y={y} innerRef={this.saveTooltipRef}>
        <Timestamp>{timestamp}</Timestamp>
        {this.props.children}
      </TooltipContainer>
    );
  }
}

export default Tooltip;
