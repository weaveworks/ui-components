import React from 'react';
import styled from 'styled-components';

import Tooltip from './_Tooltip';


const DeploymentInfoLine = styled.span`
  margin-top: 1px;
  display: block;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

class DeploymentTooltip extends React.PureComponent {
  render() {
    const {
      mouseX,
      mouseY,
      deployment,
      graphWidth,
    } = this.props;

    if (!deployment) return null;

    // TODO: Consider changing the timestamp to a more standard format.
    const timestamp = new Date(deployment.Stamp).toUTCString();
    const [action, ...serviceIDs] = deployment.Data.split(', ');

    return (
      <Tooltip x={mouseX} y={mouseY} graphWidth={graphWidth} timestamp={timestamp}>
        <DeploymentInfoLine>
          <strong>{action}</strong>
        </DeploymentInfoLine>
        {serviceIDs.map(serviceId => (
          <DeploymentInfoLine key={serviceId}>
            &rarr; {serviceId}
          </DeploymentInfoLine>
        ))}
      </Tooltip>
    );
  }
}

export default DeploymentTooltip;
