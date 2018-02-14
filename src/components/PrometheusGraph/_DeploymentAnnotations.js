import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tooltip from './_Tooltip';
import FocusPoint from './_FocusPoint';


const DeploymentInfoLine = styled.span`
  margin-top: 1px;
  display: block;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const DeploymentAnnotation = styled.div.attrs({
  style: ({ left }) => ({ left })
})`
  position: absolute;
  top: 0;
`;

const VerticalLine = styled.div.attrs({
  style: ({ height }) => ({ height }),
})`
  pointer-events: none;
  position: absolute;
  top: 0;
`;

const DeploymentAnnotationShadow = VerticalLine.extend`
  border-left: 3px solid #fff;
  margin-left: -1px;
  opacity: 0.2;
`;

const DeploymentAnnotationLine = VerticalLine.extend`
  border-left: 1px solid ${props => props.theme.colors.accent.blue};
  opacity: 0.7;
`;

const formattedDeployments = ({ deployments, timeScale }) => (
  deployments.map(({ Data, Stamp }) => {
    const [action, ...serviceIDs] = Data.split(', ');
    return {
      key: `${Data} --- ${Stamp}`,
      position: timeScale(moment(Stamp).unix()),
      timestamp: Stamp,
      serviceIDs,
      action,
    };
  })
);

class DeploymentAnnotations extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      hoveredDeployment: null,
      deployments: formattedDeployments(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ deployments: formattedDeployments(nextProps) });
  }

  handleDeploymentMouseEnter = (deployment) => {
    this.setState({ hoveredDeployment: deployment });
  }

  handleDeploymentMouseLeave = () => {
    this.setState({ hoveredDeployment: null });
  }

  render() {
    const { hoveredDeployment } = this.state;
    const { chartWidth, chartHeight } = this.props;

    return (
      <div className="deployment-annotations">
        {this.state.deployments.map(deployment => (
          <DeploymentAnnotation key={deployment.key} left={deployment.position}>
            <DeploymentAnnotationShadow height={chartHeight} />
            <DeploymentAnnotationLine height={chartHeight} />
            <FocusPoint
              hoverable
              radius="5"
              top={chartHeight}
              onMouseMove={() => this.handleDeploymentMouseEnter(deployment)}
              onMouseLeave={() => this.handleDeploymentMouseLeave()}
            />
          </DeploymentAnnotation>
        ))}
        {hoveredDeployment && (
          <Tooltip
            graphWidth={chartWidth}
            timestamp={hoveredDeployment.timestamp}
            x={hoveredDeployment.position}
            y={chartHeight}
          >
            <DeploymentInfoLine>
              <strong>{hoveredDeployment.action}</strong>
            </DeploymentInfoLine>
            {hoveredDeployment.serviceIDs.map(serviceId => (
              <DeploymentInfoLine key={serviceId}>
                &rarr; {serviceId}
              </DeploymentInfoLine>
            ))}
          </Tooltip>
        )}
      </div>
    );
  }
}

DeploymentAnnotations.propTypes = {
  chartWidth: PropTypes.number.isRequired,
  chartHeight: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  deployments: PropTypes.array.isRequired,
};

export default DeploymentAnnotations;
