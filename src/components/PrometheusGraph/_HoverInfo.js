import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { head, map, max } from 'lodash';

import TimestampTooltip from '../_TimestampTooltip';

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSizes.tiny};

  ${props =>
    props.focused &&
    `
    font-weight: bold;
  `};
`;

const TooltipRowColor = styled.span`
  background-color: ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.soft};
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
  font-family: ${props => props.theme.fontFamilies.monospace};
  margin-left: 20px;
  white-space: nowrap;
`;

const HoverLine = styled.div.attrs({
  style: ({ left, height }) => ({ left, height }),
})`
  border-left: 1px solid ${props => props.theme.colors.gray600};
  pointer-events: none;
  position: absolute;
  top: 0;
`;

const FocusPoint = styled.span.attrs({
  style: ({ top }) => ({ top }),
})`
  border: 2.5px solid ${props => props.color};
  border-radius: ${props => props.theme.borderRadius.circle};
  background-color: ${props => props.theme.colors.white};
  opacity: ${props => (props.faded ? 0.5 : 1)};
  box-sizing: border-box;
  position: absolute;
  cursor: default;
  pointer-events: none;

  ${props => `
    margin-left: ${-props.radius}px;
    margin-top: ${-props.radius}px;
    width: ${2 * props.radius}px;
    height: ${2 * props.radius}px;
  `};
`;

class HoverInfo extends React.PureComponent {
  render() {
    const {
      datapoints,
      mouseX,
      mouseY,
      valueScale,
      chartWidth,
      chartHeight,
      simpleTooltip,
    } = this.props;
    if (!datapoints) return null;

    // Simple tooltip will only show the value for the hovered series.
    const filteredHoverPoints = [...datapoints].filter(
      p => p.focused || !simpleTooltip
    );

    // Render focused circle last so that it stands out.
    const sortedHoverPoints = [...filteredHoverPoints].sort(p =>
      p.focused ? 1 : -1
    );

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
        <TimestampTooltip
          offsetX={mouseX}
          offsetY={mouseY}
          containerWidth={chartWidth}
          timestamp={timestamp}
        >
          {filteredHoverPoints.map(datapoint => (
            <TooltipRow key={datapoint.key} focused={datapoint.focused}>
              <TooltipRowColor color={datapoint.color} />
              <TooltipRowName>{head(datapoint.hoverName)}</TooltipRowName>
              <TooltipRowValue>{formatValue(datapoint.value)}</TooltipRowValue>
            </TooltipRow>
          ))}
        </TimestampTooltip>
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
  timestampSec: PropTypes.number.isRequired,
  mouseX: PropTypes.number,
  mouseY: PropTypes.number,
};

HoverInfo.defaultProps = {
  datapoints: [],
  mouseX: 0,
  mouseY: 0,
};

export default HoverInfo;
