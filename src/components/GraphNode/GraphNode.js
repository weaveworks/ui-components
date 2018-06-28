import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import { hsl } from 'd3-color';

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

const PSEUDO_COLOR = '#b1b1cb';
const hueRange = [20, 330]; // exclude red
const hueScale = scaleLinear().range(hueRange);
// map hues to lightness
const lightnessScale = scaleLinear().domain(hueRange).range([0.5, 0.7]);
const startLetterRange = 'A'.charCodeAt();
const endLetterRange = 'Z'.charCodeAt();
const letterRange = endLetterRange - startLetterRange;

/**
 * Converts a text to a 360 degree value
 */
/* eslint-disable no-restricted-properties */
function text2degree(text) {
  const input = text.substr(0, 2).toUpperCase();
  let num = 0;
  for (let i = 0; i < input.length; i += 1) {
    const charCode = Math.max(Math.min(input[i].charCodeAt(), endLetterRange), startLetterRange);
    num += Math.pow(letterRange, input.length - i - 1) * (charCode - startLetterRange);
  }
  hueScale.domain([0, Math.pow(letterRange, input.length)]);
  return hueScale(num);
}
/* eslint-enable no-restricted-properties */

function colors(text, secondText) {
  let hue = text2degree(text);
  // skip green and shift to the end of the color wheel
  if (hue > 70 && hue < 150) {
    hue += 80;
  }
  const saturation = 0.6;
  let lightness = 0.5;
  if (secondText) {
    // reuse text2degree and feed degree to lightness scale
    lightness = lightnessScale(text2degree(secondText));
  }
  return hsl(hue, saturation, lightness);
}

function getNodeColor(text = '', secondText = '', isPseudo = false) {
  if (isPseudo) {
    return PSEUDO_COLOR;
  }
  return colors(text, secondText).toString();
}

const GraphNodeWrapper = styled.g`
  cursor: pointer;
`;

const TextContainer = styled.g.attrs({
  transform: props => `translate(0, ${props.y})`,
})`
  pointer-events: none;
`;

const Label = styled.text.attrs({
  fill: props => props.theme.colors.purple800,
})``;

class GraphNode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlighted: false,
    };
  }

  handleMouseEnter = () => {
    this.setState({ highlighted: true });
  }

  handleMouseLeave = () => {
    this.setState({ highlighted: false });
  }

  render() {
    const { id, rank, label, pseudo, size, stacked } = this.props;
    const color = getNodeColor(rank, label, pseudo);
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
          highlighted={this.state.highlighted}
        />

        <TextContainer y={size / 2}>
          <Label y="15" textAnchor="middle">{label}</Label>
        </TextContainer>
      </GraphNodeWrapper>
    );
  }
}

GraphNode.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  rank: PropTypes.string,
  stacked: PropTypes.bool,
  pseudo: PropTypes.bool,
  size: PropTypes.number,
};

GraphNode.defaultProps = {
  rank: '',
  stacked: false,
  pseudo: false,
  size: 65,
};

export default GraphNode;
