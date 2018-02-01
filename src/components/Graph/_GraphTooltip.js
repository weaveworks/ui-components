import React from 'react';
import styled from 'styled-components';
import { max, map } from 'lodash';


const ColorBox = styled.span`
  background-color: ${props => props.color};
  border-radius: 1px;
  margin-right: 4px;
  min-width: 10px;
  height: 4px;
`;

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

const TooltipTimestamp = styled.div`
  font-size: 13px;
  margin-bottom: 5px;
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

const DeploymentInfo = styled.div``;

const DeploymentInfoLine = styled.span`
  margin-top: 1px;
  display: block;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

class GraphTooltip extends React.PureComponent {
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

  renderDeploymentInfo() {
    const { hoveredDeployment } = this.props;
    if (!hoveredDeployment) return null;

    const [action, ...serviceIDs] = hoveredDeployment.Data.split(', ');

    return (
      <DeploymentInfo>
        <DeploymentInfoLine>
          <strong>{action}</strong>
        </DeploymentInfoLine>
        {serviceIDs.map(serviceId => (
          <DeploymentInfoLine key={serviceId}>
            &rarr; {serviceId}
          </DeploymentInfoLine>
        ))}
      </DeploymentInfo>
    );
  }

  render() {
    const tooltipWidth = this.getTooltipBoundingRect().width;
    const {
      hoverPoints,
      hoverXOffset,
      hoverYOffset,
      hoverTimestampSec,
      hoveredDeployment,
      graphWidth,
      valueUnits,
    } = this.props;

    if (!hoverPoints && !hoveredDeployment) return null;

    // TODO: Consider changing the timestamp to a more standard format.
    const humanizedTimestamp = new Date(
      hoveredDeployment ? hoveredDeployment.Stamp : 1000 * hoverTimestampSec
    ).toUTCString();
    const x = Math.min(hoverXOffset, graphWidth - tooltipWidth - 15);

    // We want to have same formatting (precision, units, etc...) across
    // all tooltip values so we create a formatter for a reference value
    // (1 / 100 of the max value) and use it across all datapoints.
    const referenceValue = (max(map(hoverPoints, 'value')) || 0) / 100;
    const formatValue = valueUnits.formatFor(referenceValue);

    return (
      <TooltipContainer x={x} y={hoverYOffset} innerRef={this.saveTooltipRef}>
        <TooltipTimestamp>{humanizedTimestamp}</TooltipTimestamp>
        {hoveredDeployment
          ? this.renderDeploymentInfo()
          : hoverPoints.map(datapoint => (
            <TooltipRow key={datapoint.key} focused={datapoint.focused}>
              <ColorBox small color={datapoint.color} />
              <TooltipRowName>{datapoint.name}</TooltipRowName>
              <TooltipValue>{formatValue(datapoint.value)}</TooltipValue>
            </TooltipRow>
          ))}
      </TooltipContainer>
    );
  }
}

export default GraphTooltip;
