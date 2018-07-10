import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { get, noop } from 'lodash';

import theme from '../../theme';
import MatchedText from '../MatchedText';

import MatchedResults from './_MatchedResults';
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

const labelWidth = 120;

const GraphNodeWrapper = styled.g`
  cursor: pointer;
`;

const SvgTextContainer = styled.g.attrs({
  transform: props => `translate(0, ${props.y})`,
})`
  pointer-events: none;
`;

const LabelSvg = styled.text.attrs({
  fill: props => props.theme.colors.purple800,
  textAnchor: 'middle',
  y: 20,
})`
  font-size: ${props => props.theme.fontSizes.normal};
  pointer-events: all;
`;

const LabelMinorSvg = styled.text.attrs({
  fill: props => props.theme.colors.purple600,
  textAnchor: 'middle',
  y: 40,
})`
  font-size: ${props => props.theme.fontSizes.small};
  pointer-events: all;
`;

const LabelStandard = styled.span`
  color: ${props => props.theme.colors.purple800};
  font-size: ${props => props.theme.fontSizes.normal};
  display: inline-block;
  pointer-events: all;
  text-align: center;
  padding-top: 6px;
`;

const LabelMinorStandard = styled.span`
  color: ${props => props.theme.colors.purple600};
  font-size: ${props => props.theme.fontSizes.small};
  display: inline-block;
  pointer-events: all;
  text-align: center;
  padding-top: 3px;
`;

class GraphNode extends React.Component {
  renderSvgLabels() {
    return (
      <SvgTextContainer y={this.props.size / 2}>
        <LabelSvg>{this.props.label}</LabelSvg>
        <LabelMinorSvg>{this.props.labelMinor}</LabelMinorSvg>
      </SvgTextContainer>
    );
  }

  renderStandardLabels() {
    const { label, labelMinor, matches } = this.props;

    return (
      <foreignObject
        y={this.props.size / 2}
        x={-0.5 * labelWidth}
        width={labelWidth}
        height="100px"
        style={{
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <LabelStandard>
          <MatchedText noBorder text={label} match={get(matches, 'label')} />
        </LabelStandard>
        <LabelMinorStandard>
          <MatchedText
            noBorder
            text={labelMinor}
            match={get(matches, 'labelMinor')}
          />
        </LabelMinorStandard>
        <MatchedResults matches={get(matches, 'parents')} />
      </foreignObject>
    );
  }

  render() {
    const Shape = shapeMap[this.props.type];

    return (
      <GraphNodeWrapper
        onMouseEnter={() => this.props.onMouseEnter(this.props.id)}
        onMouseLeave={() => this.props.onMouseLeave(this.props.id)}
      >
        <Shape
          id={this.props.id}
          size={this.props.size}
          stacked={this.props.stacked}
          color={this.props.color}
          metricColor={this.props.metricColor}
          metricLabel={this.props.metricLabel}
          metricValue={this.props.metricValue}
          highlighted={this.props.highlighted}
        />

        {this.props.forceSvg
          ? this.renderSvgLabels()
          : this.renderStandardLabels()}
      </GraphNodeWrapper>
    );
  }
}

GraphNode.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelMinor: PropTypes.string,
  color: PropTypes.string,
  highlighted: PropTypes.bool,
  metricColor: PropTypes.string,
  metricLabel: PropTypes.string,
  metricValue: PropTypes.number,
  stacked: PropTypes.bool,
  size: PropTypes.number,
  forceSvg: PropTypes.bool,
  matches: PropTypes.shape({
    label: PropTypes.object,
    labelMinor: PropTypes.object,
    parents: PropTypes.object,
  }),
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
};

GraphNode.defaultProps = {
  labelMinor: '',
  color: theme.colors.purple400,
  highlighted: false,
  metricColor: theme.colors.status.warning,
  metricLabel: '',
  metricValue: null,
  stacked: false,
  size: 65,
  forceSvg: false,
  matches: {},
  onMouseEnter: noop,
  onMouseLeave: noop,
  onClick: noop,
};

export default GraphNode;
