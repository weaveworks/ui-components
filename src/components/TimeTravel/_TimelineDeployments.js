import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MAX_VISIBLE_RANGE_SECS = moment.duration(2, 'weeks').asSeconds();

// TODO: A lot of the code here has been taken/modified from PrometheusGraph code.
// Abstract the common code.

const DeploymentAnnotations = styled.div``;

const DeploymentAnnotation = styled.span.attrs({
  style: ({ x }) => ({ transform: `translateX(${x}px)` }),
})`
  position: absolute;
  height: 100%;
  top: 0;
`;

const VerticalLine = styled.span`
  border-left: 1px solid ${props => props.theme.colors.accent.blue};
  pointer-events: none;
  position: absolute;
  opacity: 0.5;
  height: 100%;
`;

const FocusPoint = styled.span`
  bottom: 0;
  left: ${props => -props.radius - 2}px;
  width: ${props => 2 * props.radius}px;
  height: ${props => 2 * props.radius}px;
  background-color: ${props => props.theme.colors.white};
  border: 2px solid ${props => props.theme.colors.accent.blue};
  border-radius: ${props => props.theme.borderRadius.circle};
  position: absolute;
  cursor: default;
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
            title={deployment.action}
          >
            <VerticalLine />
            <FocusPoint radius="2" />
          </DeploymentAnnotation>
        ))}
      </DeploymentAnnotations>
    );
  }
}

TimelineDeployments.propTypes = {
  width: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  deployments: PropTypes.array.isRequired,
};

export default TimelineDeployments;
