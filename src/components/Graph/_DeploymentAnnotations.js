import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const PADDING = 5;

const VerticalLine = styled.line.attrs({
  y1: props => props.height - PADDING,
  y2: PADDING,
})`
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
            <DeploymentAnnotationShadow height={height} />
            <DeploymentAnnotationLine height={height} />
            <DeploymentAnnotationPoint
              cy={height - PADDING}
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
