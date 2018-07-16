import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { noop, keys, isEmpty } from 'lodash';
import { transparentize } from 'polished';

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

const nodeBaseSize = 100;
const labelWidth = nodeBaseSize * 1.4;

const GraphNodeWrapper = styled.g.attrs({
  transform: props => `scale(${props.size / nodeBaseSize})`,
})`
  cursor: pointer;
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
  transform: 'scale(1.7)',
  textAnchor: 'middle',
})`
  font-size: ${props => props.theme.fontSizes.normal};
`;

const LabelMinorSvg = styled.text.attrs({
  fill: props =>
    props.contrastMode
      ? props.theme.colors.black
      : props.theme.colors.purple600,
  transform: 'scale(1.7)',
  textAnchor: 'middle',
  y: 20,
})`
  font-size: ${props => props.theme.fontSizes.small};
`;

const LabelsStandardContainer = styled.div`
  transform-origin: top;
  transform: scale(1.7);
`;

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

/**
 * A component for rendering labeled graph nodes.
 */
class GraphNode extends React.Component {
  findFirstSearchMatch = text => {
    let match = {};
    this.props.searchTerms.forEach(term => {
      const start = text.search(term);
      if (isEmpty(match) && start !== -1) {
        match = { start, length: term.length };
      }
    });
    return match;
  };

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
    } = this.props;

    return (
      <foreignObject
        y={nodeBaseSize / 2 + labelOffset}
        x={-0.5 * labelWidth}
        width={labelWidth}
        height="100px"
        style={{
          textAlign: 'center',
          pointerEvents: 'all',
        }}
      >
        <LabelsStandardContainer>
          <LabelStandard highlighted={highlighted} contrastMode={contrastMode}>
            <MatchedText
              noBorder
              text={label}
              match={this.findFirstSearchMatch(label)}
            />
          </LabelStandard>
          {!isEmpty(labelMinor) && (
            <LabelMinorStandard
              highlighted={highlighted}
              contrastMode={contrastMode}
            >
              <MatchedText
                noBorder
                text={labelMinor}
                match={this.findFirstSearchMatch(labelMinor)}
              />
            </LabelMinorStandard>
          )}

          {this.props.renderAppendedInfo()}
        </LabelsStandardContainer>
      </foreignObject>
    );
  }

  render() {
    const Shape = shapes[this.props.shape];

    return (
      <GraphNodeWrapper
        onMouseEnter={ev => this.props.onMouseEnter(this.props.id, ev)}
        onMouseLeave={ev => this.props.onMouseLeave(this.props.id, ev)}
        onClick={ev => this.props.onClick(this.props.id, ev)}
        size={this.props.size}
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
      </GraphNodeWrapper>
    );
  }
}

GraphNode.propTypes = {
  /**
   * A unique node ID
   */
  id: PropTypes.string.isRequired,
  /**
   * Shape of the rendered node (e.g. 'hexagon')
   */
  shape: PropTypes.oneOf(keys(shapes)).isRequired,
  /**
   * The node main label displayed right under the node shape
   */
  label: PropTypes.string.isRequired,
  /**
   * Secondary label displayed below the main label in a smaller font
   */
  labelMinor: PropTypes.string,
  /**
   * Vertical offset (in pixels) of the labels
   */
  labelOffset: PropTypes.number,
  /**
   * Shows a stack of nodes instead of a singular node if true
   */
  stacked: PropTypes.bool,
  /**
   * If true, shows the glow around the node as well as its metric data
   */
  highlighted: PropTypes.bool,
  /**
   * The color of the node in any of the standard formats
   */
  color: PropTypes.string,
  /**
   * The radius of the shape in pixels
   */
  size: PropTypes.number,
  /**
   * Renders the node in a high contrast mode
   */
  contrastMode: PropTypes.bool,
  /**
   * Displays all the node labels as SVG elements
   */
  forceSvg: PropTypes.bool,
  /**
   * The background color of the node metric fill
   */
  metricColor: PropTypes.string,
  /**
   * The formatted metric value to be displayed inside the node when highlighted
   */
  metricFormattedValue: PropTypes.string,
  /**
   * The numeric value in the interval [0, 1] representing the amount of metric fill
   */
  metricNumericValue: PropTypes.number,
  /**
   * Search terms to be applied on the node
   */
  searchTerms: PropTypes.arrayOf(PropTypes.string),
  /**
   * Render function for the info to be displayed before node labels (not working in full SVG mode)
   */
  renderPrependedInfo: PropTypes.func,
  /**
   * Render function for the info to be displayed after node labels (not working in full SVG mode)
   */
  renderAppendedInfo: PropTypes.func,
  /**
   * Callback for mouse pointer entering the node
   */
  onMouseEnter: PropTypes.func,
  /**
   * Callback for mouse pointer leaving the node
   */
  onMouseLeave: PropTypes.func,
  /**
   * Callback for mouse click on the node
   */
  onClick: PropTypes.func,
};

GraphNode.defaultProps = {
  labelMinor: '',
  labelOffset: 0,
  stacked: false,
  highlighted: false,
  color: theme.colors.purple400,
  size: nodeBaseSize,
  contrastMode: false,
  forceSvg: false,
  metricColor: theme.colors.status.warning,
  metricFormattedValue: '',
  metricNumericValue: null,
  searchTerms: [],
  renderPrependedInfo: noop,
  renderAppendedInfo: noop,
  onMouseEnter: noop,
  onMouseLeave: noop,
  onClick: noop,
};

export default GraphNode;
