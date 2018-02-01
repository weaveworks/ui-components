import React from 'react';
import styled from 'styled-components';
import { max, map } from 'lodash';

import Tooltip from './_Tooltip';


const ColorBox = styled.span`
  background-color: ${props => props.color};
  border-radius: 1px;
  margin-right: 4px;
  min-width: 10px;
  height: 4px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;

  ${props =>
    props.focused &&
    `
    font-weight: bold;
    font-size: 13px;
  `};
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

const TooltipValue = styled.span`
  font-family: 'Roboto', sans-serif;
  margin-left: 20px;
  white-space: nowrap;
`;

class GraphTooltip extends React.PureComponent {
  render() {
    const {
      datapoints,
      mouseX,
      mouseY,
      timestampSec,
      graphWidth,
      valueUnits,
    } = this.props;

    if (!datapoints) return null;

    // TODO: Consider changing the timestamp to a more standard format.
    const timestamp = new Date(1000 * timestampSec).toUTCString();

    // We want to have same formatting (precision, units, etc...) across
    // all tooltip values so we create a formatter for a reference value
    // (1 / 100 of the max value) and use it across all datapoints.
    const referenceValue = (max(map(datapoints, 'value')) || 0) / 100;
    const formatValue = valueUnits.formatFor(referenceValue);

    return (
      <Tooltip x={mouseX} y={mouseY} graphWidth={graphWidth} timestamp={timestamp}>
        {datapoints.map(datapoint => (
          <TooltipRow key={datapoint.key} focused={datapoint.focused}>
            <ColorBox small color={datapoint.color} />
            <TooltipRowName>{datapoint.name}</TooltipRowName>
            <TooltipValue>{formatValue(datapoint.value)}</TooltipValue>
          </TooltipRow>
        ))}
      </Tooltip>
    );
  }
}

export default GraphTooltip;
