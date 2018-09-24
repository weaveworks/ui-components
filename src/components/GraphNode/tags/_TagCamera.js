import React from 'react';
import styled from 'styled-components';

const Rect = styled.rect.attrs({
  fill: props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple800,
  rx: 5,
})``;

const Circle = styled.circle.attrs({
  stroke: props => props.theme.colors.white,
  fill: props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple800,
})``;

export default class TagCamera extends React.Component {
  render() {
    return (
      <g transform="translate(16, 6) scale(0.75)">
        <Rect {...this.props} x="0" y="4" width="30" height="24" />
        <Rect {...this.props} x="5" y="0" width="20" height="25" />
        <Circle {...this.props} cx="15" cy="15" r="6" strokeWidth="4" />
      </g>
    );
  }
}
