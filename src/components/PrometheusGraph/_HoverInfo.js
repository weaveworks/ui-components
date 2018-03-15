import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { map, max } from 'lodash';

import Tooltip from './_Tooltip';
import FocusPoint from './_FocusPoint';


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
  border-left: 1px solid ${props => props.theme.colors.gray};
  pointer-events: none;
  position: absolute;
  top: 0;
`;

class HoverInfo extends React.PureComponent {
  render() {
    const {
      datapoints, mouseX, mouseY, valueScale, chartWidth, chartHeight, simpleTooltip,
    } = this.props;
    if (!datapoints) return null;

    // Simple tooltip will only show the value for the hovered series.
    const filteredHoverPoints = [...datapoints].filter(p => p.focused || !simpleTooltip);

    // Render focused circle last so that it stands out.
    const sortedHoverPoints = [...filteredHoverPoints].sort(p => (p.focused ? 1 : -1));

    const timestamp = moment.unix(this.props.timestampSec).format();

    // We want to have same formatting (precision, units, etc...) across
    // all tooltip values so we create a formatter for a reference value
    // (1 / 10 of the max value) and use it across all datapoints.
    const referenceValue = (max(map(datapoints, 'value')) || 0) / 10;
    const formatValue = this.props.valueFormatter(referenceValue);

    return (
      <div>
        <HoverLine left={mouseX} height={chartHeight}>
          {sortedHoverPoints.map(datapoint => (
            <FocusPoint
              key={datapoint.key}
              color={datapoint.color}
              faded={!datapoint.focused}
              radius={datapoint.focused ? 5 : 4}
              top={valueScale(datapoint.graphValue)}
            />
          ))}
        </HoverLine>
        <Tooltip x={mouseX} y={mouseY} graphWidth={chartWidth} timestamp={timestamp}>
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
  valueFormatter: PropTypes.func.isRequired,
  simpleTooltip: PropTypes.bool.isRequired,
  datapoints: PropTypes.array,
  timestampSec: PropTypes.number,
  mouseX: PropTypes.number,
  mouseY: PropTypes.number,
};

export default HoverInfo;
