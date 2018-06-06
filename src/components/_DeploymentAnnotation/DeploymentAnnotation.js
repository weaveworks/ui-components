import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TimestampTooltip from '../_TimestampTooltip';

const DeploymentAnnotationWrapper = styled.div`
  position: absolute;
  height: 100%;
`;

const DeploymentAnnotationContainer = styled.div.attrs({
  style: ({ x }) => ({ left: x }),
})`
  pointer-events: all;
  position: absolute;
  height: 100%;
`;

const FocusPoint = styled.span`
  border-radius: ${props => props.theme.borderRadius.circle};
  border: 2.5px solid ${props => props.theme.colors.accent.blue};
  background-color: ${props => props.theme.colors.white};
  box-sizing: border-box;
  position: absolute;
  cursor: default;

  ${props => `
    margin-left: ${-props.radius}px;
    margin-top: ${-props.radius}px;
    width: ${2 * props.radius}px;
    height: ${2 * props.radius}px;
    bottom: ${-props.radius}px;
  `};
`;

const VerticalLine = styled.div`
  pointer-events: none;
  position: absolute;
  height: 100%;
  top: 0;
`;

const AnnotationShadow = VerticalLine.extend`
  border-left: 3px solid ${props => props.theme.colors.white};
  margin-left: -1px;
  opacity: 0.2;
`;

const AnnotationLine = VerticalLine.extend`
  border-left: 1px solid ${props => props.theme.colors.accent.blue};
  opacity: 0.7;
`;

const InfoLine = styled.span`
  font-size: ${props => props.theme.fontSizes.small};
  margin-top: 1px;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

class DeploymentAnnotations extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isHovered: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  render() {
    return (
      <DeploymentAnnotationWrapper>
        <DeploymentAnnotationContainer x={this.props.x}>
          <AnnotationShadow />
          <AnnotationLine />
          <FocusPoint
            hoverable
            radius="5"
            onMouseMove={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          />
        </DeploymentAnnotationContainer>
        {this.state.isHovered && (
          <TimestampTooltip
            timestamp={this.props.timestamp}
            containerWidth={this.props.containerWidth}
            offsetY={this.props.containerHeight}
            offsetX={this.props.x}
          >
            <InfoLine>
              <strong>{this.props.action}</strong>
            </InfoLine>
            {this.props.serviceIDs.map(serviceId => (
              <InfoLine key={serviceId}>
                &rarr; {serviceId}
              </InfoLine>
            ))}
          </TimestampTooltip>
        )}
      </DeploymentAnnotationWrapper>
    );
  }
}

DeploymentAnnotations.propTypes = {
  x: PropTypes.number.isRequired,
  action: PropTypes.string.isRequired,
  serviceIDs: PropTypes.array.isRequired,
  timestamp: PropTypes.string.isRequired,
  containerWidth: PropTypes.number.isRequired,
  containerHeight: PropTypes.number.isRequired,
};

export default DeploymentAnnotations;
