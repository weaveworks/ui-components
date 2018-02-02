import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

const ANNOTATION_CIRCLE_RADIUS = 5;

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
  border-left: 2px solid #fff;
  opacity: 0.2;
`;

const DeploymentAnnotationLine = VerticalLine.extend`
  border-left: 0.5px solid #00d3ff;
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

class DeploymentAnnotations extends React.PureComponent {
  render() {
    const { height, timeScale } = this.props;

    return (
      <div className="deployment-annotations" style={{ position: 'absolute', top: 0 }}>
        {this.props.deployments.map(d => (
          <DeploymentAnnotation
            key={d.Data}
            left={timeScale(moment(d.Stamp).unix())}
          >
            <DeploymentAnnotationShadow height={height} />
            <DeploymentAnnotationLine height={height} />
            <DeploymentAnnotationPoint
              top={height}
              onMouseMove={() => this.props.onDeploymentMouseEnter(d)}
              onMouseLeave={() => this.props.onDeploymentMouseLeave()}
            />
          </DeploymentAnnotation>
        ))}
      </div>
    );
  }
}

export default DeploymentAnnotations;
