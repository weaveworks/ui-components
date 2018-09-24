import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { keys, isEmpty } from 'lodash';
import { transparentize } from 'polished';

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
import TagCamera from './tags/_TagCamera';

export const nodeBaseSize = 55;
export const shapes = {
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
export const tags = {
  none: () => null,
  camera: TagCamera,
};

const labelWidth = nodeBaseSize * 2.5;

const GraphNodeWrapper = styled.g`
  cursor: ${props => props.cursorType};
`;

const SvgTextContainer = styled.g.attrs({
  transform: props => `translate(0, ${props.y + 85})`,
})`
  pointer-events: all;
`;

const LabelSvg = styled.text.attrs({
  fill: props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple800,
  textAnchor: 'middle',
  y: -38,
})`
  font-size: ${props => props.theme.fontSizes.normal};
`;

const LabelMinorSvg = styled.text.attrs({
  fill: props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple600,
  textAnchor: 'middle',
  y: -20,
})`
  font-size: ${props => props.theme.fontSizes.small};
`;

const LabelsStandardContainer = styled.div``;

const LabelTemplate = styled.div`
  background-color: ${props =>
    transparentize(
      0.2,
      props.contrastMode
        ? props.theme.colors.white
        : props.theme.colors.purple25
    )};
  border-radius: ${props => props.theme.borderRadius.soft};
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  text-align: center;
  padding: 2px 10px;
  max-width: 100%;
  pointer-events: all;

  ${props =>
    !props.highlighted &&
    `
      white-space: nowrap;
    `};
`;

const LabelStandard = LabelTemplate.extend`
  color: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple800};
  font-size: ${props => props.theme.fontSizes.normal};
  margin-top: 4px;
`;

const LabelMinorStandard = LabelTemplate.extend`
  color: ${props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple600};
  font-size: ${props => props.theme.fontSizes.small};
  margin-top: -7px;
`;

class GraphNodeStatic extends React.PureComponent {
  renderSvgLabels() {
    return (
      <SvgTextContainer y={this.props.labelOffset}>
        <LabelSvg contrastMode={this.props.contrastMode}>
          {this.props.label}
        </LabelSvg>
        <LabelMinorSvg contrastMode={this.props.contrastMode}>
          {this.props.labelMinor}
        </LabelMinorSvg>
      </SvgTextContainer>
    );
  }

  renderStandardLabels() {
    const {
      label,
      labelMinor,
      highlighted,
      contrastMode,
      labelOffset,
      searchTerms,
    } = this.props;

    return (
      <foreignObject
        y={nodeBaseSize / 2 + labelOffset}
        x={-0.5 * labelWidth}
        width={labelWidth}
        height="200px"
        style={{
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <LabelsStandardContainer>
          <LabelStandard highlighted={highlighted} contrastMode={contrastMode}>
            <MatchedText text={label} matches={searchTerms} />
          </LabelStandard>
          {!isEmpty(labelMinor) && (
            <LabelMinorStandard
              highlighted={highlighted}
              contrastMode={contrastMode}
            >
              <MatchedText text={labelMinor} matches={searchTerms} />
            </LabelMinorStandard>
          )}

          {this.props.renderAppendedInfo()}
        </LabelsStandardContainer>
      </foreignObject>
    );
  }

  handleMouseEnter = ev => {
    this.props.onMouseEnter(this.props.id, ev);
  };

  handleMouseLeave = ev => {
    this.props.onMouseLeave(this.props.id, ev);
  };

  handleClick = ev => {
    this.props.onClick(this.props.id, ev);
  };

  render() {
    const Shape = shapes[this.props.shape];
    const Tag = tags[this.props.tag];

    return (
      <GraphNodeWrapper
        cursorType={this.props.cursorType}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleClick}
      >
        {this.props.renderPrependedInfo()}

        {this.props.forceSvg
          ? this.renderSvgLabels()
          : this.renderStandardLabels()}

        <Shape
          id={this.props.id}
          size={nodeBaseSize}
          stacked={this.props.stacked}
          color={this.props.color}
          metricColor={this.props.metricColor}
          metricFormattedValue={this.props.metricFormattedValue}
          metricNumericValue={this.props.metricNumericValue}
          highlighted={this.props.highlighted}
          contrastMode={this.props.contrastMode}
        />

        <Tag contrastMode={this.props.contrastMode} />
      </GraphNodeWrapper>
    );
  }
}

GraphNodeStatic.propTypes = {
  id: PropTypes.string.isRequired,
  shape: PropTypes.oneOf(keys(shapes)).isRequired,
  tag: PropTypes.oneOf(keys(tags)).isRequired,
  label: PropTypes.string.isRequired,
  labelMinor: PropTypes.string.isRequired,
  labelOffset: PropTypes.number.isRequired,
  stacked: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool.isRequired,
  color: PropTypes.string.isRequired,
  contrastMode: PropTypes.bool.isRequired,
  forceSvg: PropTypes.bool.isRequired,
  metricColor: PropTypes.string.isRequired,
  metricFormattedValue: PropTypes.string.isRequired,
  metricNumericValue: PropTypes.number.isRequired,
  searchTerms: PropTypes.arrayOf(PropTypes.string).isRequired,
  cursorType: PropTypes.string.isRequired,
  renderPrependedInfo: PropTypes.func.isRequired,
  renderAppendedInfo: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default GraphNodeStatic;
