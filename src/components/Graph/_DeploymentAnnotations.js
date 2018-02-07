import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Tooltip from './_Tooltip';


const ANNOTATION_CIRCLE_RADIUS = 5;

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
  border-left: 1px solid #00d3ff;
  opacity: 0.7;
`;

const DeploymentAnnotationPoint = styled.span`
  cursor: default;
  position: absolute;
  background-color: #fff;
  box-sizing: border-box;
  border-radius: 50%;
  border: 2.5px solid #00d2ff;
  width: ${2 * ANNOTATION_CIRCLE_RADIUS}px;
  height: ${2 * ANNOTATION_CIRCLE_RADIUS}px;
  margin-left: -${ANNOTATION_CIRCLE_RADIUS}px;
  margin-top: -${ANNOTATION_CIRCLE_RADIUS}px;
  top: ${props => props.top}px;
`;

const formattedDeployments = ({ deployments, timeScale }) => (
  deployments.map(({ Data, Stamp }) => {
    const [action, ...serviceIDs] = Data.split(', ');
    return {
      key: `${Data} --- ${Stamp}`,
      position: timeScale(moment(Stamp).unix()),
      // TODO: Consider changing the timestamp to a more standard format.
      humanizedTimestamp: new Date(Stamp).toUTCString(),
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

    this.handleDeploymentMouseEnter = this.handleDeploymentMouseEnter.bind(this);
    this.handleDeploymentMouseLeave = this.handleDeploymentMouseLeave.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ deployments: formattedDeployments(nextProps) });
  }

  handleDeploymentMouseEnter(deployment) {
    this.setState({ hoveredDeployment: deployment });
  }

  handleDeploymentMouseLeave() {
    this.setState({ hoveredDeployment: null });
  }

  render() {
    const { hoveredDeployment } = this.state;
    const { width, height } = this.props;

    return (
      <div className="deployment-annotations">
        {this.state.deployments.map(deployment => (
          <DeploymentAnnotation key={deployment.key} left={deployment.position}>
            <DeploymentAnnotationShadow height={height} />
            <DeploymentAnnotationLine height={height} />
            <DeploymentAnnotationPoint
              top={height}
              onMouseMove={() => this.handleDeploymentMouseEnter(deployment)}
              onMouseLeave={() => this.handleDeploymentMouseLeave()}
            />
          </DeploymentAnnotation>
        ))}
        {hoveredDeployment && (
          <Tooltip
            graphWidth={width}
            humanizedTimestamp={hoveredDeployment.humanizedTimestamp}
            x={hoveredDeployment.position}
            y={height}
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
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  deployments: PropTypes.array.isRequired,
};

export default DeploymentAnnotations;
