import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { format } from 'd3-format';
import { constant } from 'lodash';

import theme from '../../theme';

import ShapeCircle from './shapes/_ShapeCircle';
import ShapeTriangle from './shapes/_ShapeTriangle';
import ShapeSquare from './shapes/_ShapeSquare';
import ShapePentagon from './shapes/_ShapePentagon';
import ShapeHexagon from './shapes/_ShapeHexagon';
import ShapeHeptagon from './shapes/_ShapeHeptagon';
import ShapeOctagon from './shapes/_ShapeOctagon';
import ShapeCloud from './shapes/_ShapeCloud';
import ShapeSheet from './shapes/_ShapeSheet';
import ShapeCylinder from './shapes/_ShapeCylinder';
import ShapeDottedCylinder from './shapes/_ShapeDottedCylinder';

export const shapeMap = {
  circle: ShapeCircle,
  triangle: ShapeTriangle,
  square: ShapeSquare,
  pentagon: ShapePentagon,
  hexagon: ShapeHexagon,
  heptagon: ShapeHeptagon,
  octagon: ShapeOctagon,
  cloud: ShapeCloud,
  sheet: ShapeSheet,
  cylinder: ShapeCylinder,
  dottedcylinder: ShapeDottedCylinder,
};

const GraphNodeWrapper = styled.g`
  cursor: pointer;
`;

const TextContainer = styled.g.attrs({
  transform: props => `translate(0, ${props.y})`,
})`
  pointer-events: all;
`;

const Label = styled.text.attrs({
  fill: props => props.theme.colors.purple800,
})`
  font-size: ${props => props.theme.fontSizes.normal};
`;

const LabelMinor = styled.text.attrs({
  fill: props => props.theme.colors.purple600,
})`
  font-size: ${props => props.theme.fontSizes.small};
`;

class GraphNode extends React.Component {
  state = {
    highlighted: false,
  };

  handleMouseEnter = () => {
    this.setState({ highlighted: true });
  };

  handleMouseLeave = () => {
    this.setState({ highlighted: false });
  };

  renderSvgLabels() {
    return (
      <TextContainer y={this.props.size / 2}>
        <Label y="20" textAnchor="middle">
          {this.props.label}
        </Label>
        <LabelMinor y="40" textAnchor="middle">
          {this.props.labelMinor}
        </LabelMinor>
      </TextContainer>
    );
  }

  render() {
    const { id, label, size, stacked, metricValue } = this.props;
    const metricLabel = metricValue
      ? this.props.metricLabelFunction(metricValue)
      : '';
    const metricColor = this.props.metricColorFunction(metricValue);
    const color = this.props.colorFunction({ label });
    const Shape = shapeMap[this.props.type];

    return (
      <GraphNodeWrapper
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <Shape
          id={id}
          color={color}
          size={size}
          stacked={stacked}
          metricColor={metricColor}
          metricLabel={metricLabel}
          metricValue={metricValue}
          highlighted={this.state.highlighted}
        />

        {this.renderSvgLabels()}
      </GraphNodeWrapper>
    );
  }
}

GraphNode.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelMinor: PropTypes.string,
  colorFunction: PropTypes.func,
  metricColorFunction: PropTypes.func,
  metricLabelFunction: PropTypes.func,
  metricValue: PropTypes.number,
  stacked: PropTypes.bool,
  size: PropTypes.number,
};

GraphNode.defaultProps = {
  labelMinor: '',
  colorFunction: constant(theme.colors.purple400),
  metricColorFunction: constant(theme.colors.status.warning),
  metricLabelFunction: format('.0%'),
  metricValue: undefined,
  stacked: false,
  size: 65,
};

export default GraphNode;
