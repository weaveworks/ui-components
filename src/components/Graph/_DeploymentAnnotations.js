import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const VerticalLine = styled.line`
  pointer-events: none;
`;

const DeploymentAnnotationShadow = VerticalLine.extend.attrs({
  stroke: '#fff',
  strokeWidth: 2,
  opacity: 0.2,
})``;

const DeploymentAnnotationLine = VerticalLine.extend.attrs({
  stroke: '#00d2ff',
  strokeWidth: 0.5,
})``;

const DeploymentAnnotationPoint = styled.circle.attrs({
  r: 3.5,
  strokeWidth: 2.5,
  stroke: '#00d2ff',
  fill: '#fff',
})`
  cursor: default;
`;

class DeploymentAnnotations extends React.PureComponent {
  render() {
    const { height, timeScale } = this.props;

    return (
      <g className="deployment-annotations">
        {this.props.deployments.map(d => (
          <g
            key={d.Data}
            transform={`translate(${timeScale(moment(d.Stamp).unix())})`}
          >
            <DeploymentAnnotationShadow y2={height} />
            <DeploymentAnnotationLine y2={height} />
            <DeploymentAnnotationPoint
              cy={height}
              onMouseMove={() => this.props.onDeploymentMouseEnter(d)}
              onMouseLeave={() => this.props.onDeploymentMouseLeave()}
            />
          </g>
        ))}
      </g>
    );
  }
}

export default DeploymentAnnotations;
