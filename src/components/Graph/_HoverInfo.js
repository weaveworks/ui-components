import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tooltip from './_Tooltip';


const HOVER_CIRCLE_RADIUS = 4;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;

  ${props => props.focused && `
    font-weight: bold;
    font-size: 13px;
  `};
`;

const TooltipRowColor = styled.span`
  background-color: ${props => props.color};
  border-radius: 1px;
  margin-right: 4px;
  min-width: 10px;
  height: 4px;
`;

const TooltipRowName = styled.span`
  flex-grow: 1;
  white-space: pre;
  display: block;
  align-items: center;
  margin-right: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const TooltipRowValue = styled.span`
  font-family: 'Roboto', sans-serif;
  margin-left: 20px;
  white-space: nowrap;
`;

const HoverLine = styled.div.attrs({
  style: ({ left, height }) => ({ left, height }),
})`
  border-left: 1px solid #aaa;
  pointer-events: none;
  position: absolute;
  top: 0;
`;

const HoverCircle = styled.span.attrs({
  style: ({ top }) => ({ top }),
})`
  border: 3px solid ${props => props.color};
  opacity: ${props => (props.focused ? 1 : 0.5)};
  margin-left: -${HOVER_CIRCLE_RADIUS}px;
  margin-top: -${HOVER_CIRCLE_RADIUS}px;
  width: ${2 * HOVER_CIRCLE_RADIUS}px;
  height: ${2 * HOVER_CIRCLE_RADIUS}px;
  box-sizing: border-box;
  background-color: #fff;
  pointer-events: none;
  border-radius: 50%;
  position: absolute;
`;

class HoverInfo extends React.PureComponent {
  render() {
    const {
      datapoints, mouseX, mouseY, valueScale, chartWidth, chartHeight, formatValue, simpleTooltip,
    } = this.props;
    if (!datapoints) return null;


    // Simple tooltip will only show the value for the hovered series.
    const filteredHoverPoints = [...datapoints].filter(p => p.focused || !simpleTooltip);

    // Render focused circle last so that it stands out.
    const sortedHoverPoints = [...filteredHoverPoints].sort(p => (p.focused ? 1 : -1));

    // TODO: Consider changing the timestamp to a more standard format.
    const timestamp = new Date(1000 * this.props.timestampSec).toUTCString();

    return (
      <div>
        <HoverLine left={mouseX} height={chartHeight}>
          {sortedHoverPoints.map(datapoint => (
            <HoverCircle
              key={datapoint.key}
              color={datapoint.color}
              focused={datapoint.focused}
              top={valueScale(datapoint.graphValue)}
            />
          ))}
        </HoverLine>
        <Tooltip x={mouseX} y={mouseY} graphWidth={chartWidth} humanizedTimestamp={timestamp}>
          {filteredHoverPoints.map(datapoint => (
            <TooltipRow key={datapoint.key} focused={datapoint.focused}>
              <TooltipRowColor color={datapoint.color} />
              <TooltipRowName>{datapoint.name}</TooltipRowName>
              <TooltipRowValue>{formatValue(datapoint.value)}</TooltipRowValue>
            </TooltipRow>
          ))}
        </Tooltip>
      </div>
    );
  }
}

HoverInfo.propTypes = {
  chartWidth: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired,
  valueScale: PropTypes.func.isRequired,
  formatValue: PropTypes.func.isRequired,
  simpleTooltip: PropTypes.bool.isRequired,
  datapoints: PropTypes.array,
  timestampSec: PropTypes.number,
  mouseX: PropTypes.number,
  mouseY: PropTypes.number,
};

export default HoverInfo;
