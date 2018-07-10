import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { format } from 'd3-format';
import { constant, get } from 'lodash';

import theme from '../../theme';
import MatchedText from '../MatchedText';

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

const LabelStandard = styled.div`
  color: ${props => props.theme.colors.purple800};
  font-size: ${props => props.theme.fontSizes.normal};
  pointer-events: all;
  text-align: center;
  margin-top: 6px;
`;

const LabelMinorStandard = styled.div`
  color: ${props => props.theme.colors.purple600};
  font-size: ${props => props.theme.fontSizes.small};
  pointer-events: all;
  text-align: center;
  margin-top: 3px;
`;

const MatchedResults = styled.div``;

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
        style={{ pointerEvents: 'none' }}
      >
        <LabelStandard>
          <MatchedText text={label} match={get(matches, 'label')} />
        </LabelStandard>
        <LabelMinorStandard>
          <MatchedText text={labelMinor} match={get(matches, 'labelMinor')} />
        </LabelMinorStandard>
        <MatchedResults matches={get(matches, 'parents')} />
      </foreignObject>
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
  colorFunction: PropTypes.func,
  metricColorFunction: PropTypes.func,
  metricLabelFunction: PropTypes.func,
  metricValue: PropTypes.number,
  stacked: PropTypes.bool,
  size: PropTypes.number,
  forceSvg: PropTypes.bool,
  matches: PropTypes.shape({
    label: PropTypes.object,
    labelMinor: PropTypes.object,
    parents: PropTypes.object,
  }),
};

GraphNode.defaultProps = {
  labelMinor: '',
  colorFunction: constant(theme.colors.purple400),
  metricColorFunction: constant(theme.colors.status.warning),
  metricLabelFunction: format('.0%'),
  metricValue: undefined,
  stacked: false,
  size: 65,
  forceSvg: false,
  matches: {},
};

export default GraphNode;
