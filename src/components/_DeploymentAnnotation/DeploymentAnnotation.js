import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router';

import TimestampTooltip from '../_TimestampTooltip';

const DeploymentAnnotationWrapper = styled.div.attrs({
  // Override the parent tooltip
  title: '',
})`
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
  border: 2.5px solid ${props => props.theme.colors.blue400};
  background-color: ${props => props.theme.colors.white};
  box-sizing: border-box;
  position: absolute;

  ${props => `
    margin-left: -${props.radius}px;
    margin-top: ${props.radius}px;
    width: ${2 * props.radius}px;
    height: ${2 * props.radius}px;
    bottom: -${props.onAxis ? props.radius : 0}px;
  `};
`;

const VerticalLine = styled.div`
  pointer-events: none;
  position: absolute;
  height: 100%;
  top: 0;
`;

const AnnotationShadow = styled(VerticalLine)`
  border-left: 3px solid ${props => props.theme.colors.white};
  margin-left: -1px;
  opacity: 0.2;
`;

const AnnotationLine = styled(VerticalLine)`
  border-left: 1px solid ${props => props.theme.colors.blue400};
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

const NoLink = styled.span`
  cursor: default;
`;

const MaybeLinkable = ({ linkTo, children }) =>
  linkTo ? <Link to={linkTo}>{children}</Link> : <NoLink>{children}</NoLink>;

class DeploymentAnnotations extends React.PureComponent {
  state = {
    isHovered: false,
  };

  handleMouseEnter = () => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovered: false });
  };

  handleClick = () => {
    const { action, serviceIDs, timestamp } = this.props;
    this.props.onClick({ action, serviceIDs, timestamp });
  };

  render() {
    return (
      <DeploymentAnnotationWrapper>
        <DeploymentAnnotationContainer x={this.props.x}>
          <AnnotationShadow />
          <AnnotationLine />
          <MaybeLinkable linkTo={this.props.linkTo}>
            <FocusPoint
              hoverable
              radius="5"
              onAxis={this.props.onAxis}
              onMouseMove={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
              onClick={this.handleClick}
            />
          </MaybeLinkable>
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
              <InfoLine key={serviceId}>&rarr; {serviceId}</InfoLine>
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
  onClick: PropTypes.func.isRequired,
  linkTo: PropTypes.string,
  onAxis: PropTypes.bool,
};

DeploymentAnnotations.defaultProps = {
  linkTo: '',
  onAxis: false,
};

export default DeploymentAnnotations;
