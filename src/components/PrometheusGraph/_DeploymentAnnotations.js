import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DeploymentAnnotation from '../_DeploymentAnnotation';

const DeploymentAnnotationsWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const formattedDeployments = ({ deployments, timeScale, chartWidth }) =>
  deployments
    .map(({ Data, Stamp }) => {
      const [action, ...serviceIDs] = Data.split(', ');
      return {
        key: `${Data} --- ${Stamp}`,
        position: timeScale(moment(Stamp).unix()),
        timestamp: moment(Stamp).format(),
        serviceIDs,
        action,
      };
    })
    .filter(
      ({ position }) =>
        // Filter out all the deployments that fall out of the chart.
        chartWidth >= position && position >= 0
    );

class DeploymentAnnotations extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      deployments: formattedDeployments(props),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ deployments: formattedDeployments(nextProps) });
  }

  render() {
    const [startTimeSec, endTimeSec] = this.props.timeScale.domain();
    if (!startTimeSec || !endTimeSec) return null;

    return (
      <DeploymentAnnotationsWrapper>
        {this.state.deployments.map(deployment => (
          <DeploymentAnnotation
            key={deployment.key}
            x={deployment.position}
            action={deployment.action}
            serviceIDs={deployment.serviceIDs}
            timestamp={deployment.timestamp}
            containerWidth={this.props.chartWidth}
            containerHeight={this.props.chartHeight}
            onAxis
          />
        ))}
      </DeploymentAnnotationsWrapper>
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
