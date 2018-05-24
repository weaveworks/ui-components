import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MAX_VISIBLE_RANGE_SECS = moment.duration(2, 'weeks').asSeconds();

// TODO: A lot of the code here has been taken/modified from PrometheusGraph code.
// Abstract the common code.

const DeploymentAnnotation = styled.g.attrs({
  transform: ({ left }) => `translate(${left}, 0)`,
})`
  position: absolute;
  top: 0;
`;

const VerticalLine = styled.line.attrs({
  y2: ({ height }) => height,
  stroke: ({ theme }) => theme.colors.accent.blue,
  strokeWidth: 1,
})`
  pointer-events: none;
  position: absolute;
  opacity: 0.5;
`;

const FocusPoint = styled.circle.attrs({
  r: ({ radius }) => radius,
  fill: ({ theme }) => theme.colors.white,
  transform: ({ height, radius }) => `translate(0, ${height - radius - 2})`,
  stroke: ({ color, theme }) => color || theme.colors.accent.blue,
  strokeWidth: 2,
})`
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
      <g className="deployment-annotations">
        {this.state.deployments.map(deployment => (
          <DeploymentAnnotation key={deployment.key} left={deployment.position}>
            <VerticalLine height={height} />
            <FocusPoint radius="3" height={height} />
            <title>{deployment.action}</title>
          </DeploymentAnnotation>
        ))}
      </g>
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
