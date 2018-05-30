import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MAX_VISIBLE_RANGE_SECS = moment.duration(2, 'weeks').asSeconds();

// TODO: A lot of the code here has been taken/modified from PrometheusGraph code.
// Abstract the common code.

const DeploymentAnnotation = styled.span.attrs({
  style: ({ left }) => ({ transform: `translateX(${left}px)` }),
})`
  position: absolute;
  top: 0;
`;

const VerticalLine = styled.span`
  border-left: 1px solid ${props => props.theme.colors.accent.blue};
  height: ${props => props.height}px;
  pointer-events: none;
  position: absolute;
  opacity: 0.5;
`;

const FocusPoint = styled.span`
  width: ${props => 2 * props.radius}px;
  height: ${props => 2 * props.radius}px;
  margin-left: ${props => -props.radius - 2}px;
  margin-top: ${props => props.height - (2 * props.radius) - 4}px;
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
    const { height, timeScale } = this.props;

    const [startTimeSec, endTimeSec] = timeScale.domain();
    if (!startTimeSec || !endTimeSec) return null;

    // Don't show deployment annotations if we've zoomed out too much.
    // See https://github.com/weaveworks/service-ui/issues/1858.
    if (endTimeSec - startTimeSec > MAX_VISIBLE_RANGE_SECS) return null;

    return (
      <div className="deployment-annotations">
        {this.state.deployments.map(deployment => (
          <DeploymentAnnotation
            key={deployment.key}
            left={deployment.position}
            title={deployment.action}
          >
            <VerticalLine height={height} />
            <FocusPoint radius="2" height={height} />
          </DeploymentAnnotation>
        ))}
      </div>
    );
  }
}

TimelineDeployments.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  timeScale: PropTypes.func.isRequired,
  deployments: PropTypes.array.isRequired,
};

export default TimelineDeployments;
