import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DeploymentAnnotation from '../_DeploymentAnnotation';

const MAX_VISIBLE_RANGE_SECS = moment.duration(2, 'weeks').asSeconds();

// TODO: A lot of the code here has been taken/modified from PrometheusGraph code.
// Abstract the common code.

const DeploymentAnnotations = styled.div`
  position: absolute;
  height: 100%;
`;

const formattedDeployments = ({ deployments, timeScale, width }) =>
  deployments
    .map(({ Data, Stamp }) => {
      const [action, ...serviceIDs] = Data.split(', ');
      return {
        key: `${Data} --- ${Stamp}`,
        position: timeScale(moment(Stamp)),
        timestamp: moment(Stamp).format(),
        serviceIDs,
        action,
      };
    })
    .filter(
      ({ position }) =>
        // Filter out all the deployments that fall out of the timeline.
        -width / 2 <= position && position <= width / 2
    );

class TimelineDeployments extends React.PureComponent {
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
    const { timeScale } = this.props;

    const [startTimeSec, endTimeSec] = timeScale.domain();
    if (!startTimeSec || !endTimeSec) return null;

    // Don't show deployment annotations if we've zoomed out too much.
    // See https://github.com/weaveworks/service-ui/issues/1858.
    if (endTimeSec - startTimeSec > MAX_VISIBLE_RANGE_SECS) return null;

    return (
      <DeploymentAnnotations>
        {this.state.deployments.map(deployment => (
          <DeploymentAnnotation
            key={deployment.key}
            x={deployment.position}
            action={deployment.action}
            serviceIDs={deployment.serviceIDs}
            timestamp={deployment.timestamp}
            linkTo={this.props.linkBuilder(deployment)}
            containerWidth={this.props.width}
            containerHeight={55}
          />
        ))}
      </DeploymentAnnotations>
    );
  }
}

TimelineDeployments.propTypes = {
  width: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  deployments: PropTypes.array.isRequired,
  linkBuilder: PropTypes.func.isRequired,
};

export default TimelineDeployments;
