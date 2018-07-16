import React from 'react';
import faker from 'faker';
import { format } from 'd3-format';
import { keys, times, sample, compact } from 'lodash';
import styled from 'styled-components';

import { Example, Info } from '../../utils/example';
import Search from '../Search';

import GraphNode, { shapes } from './GraphNode';

const nodeTypes = keys(shapes);
const colorFunction = label =>
  `hsl(${(label.charCodeAt(0) - 97) * 10}, 50%, 65%)`;

const GraphNodeContainer = ({ size, children }) => (
  <svg width={`${2.5 * size}px`} height={`${3 * size}px`}>
    <g style={{ transform: `translate(${size * 1.2}px, ${size * 1.6}px)` }}>
      {children}
    </g>
  </svg>
);

const CheckBox = styled.input.attrs({
  type: 'checkbox',
})`
  margin-right: 10px;
  margin-bottom: 30px;
`;

const TextInput = styled.input.attrs({
  type: 'input',
})`
  text-align: right;
  margin-left: 30px;
  margin-right: 5px;
  width: 40px;
`;

export default class GraphNodeExample extends React.Component {
  state = {
    availableShapes: nodeTypes.map(shape => ({
      shape,
      key: faker.lorem.slug(),
    })),
    stackedShape: nodeTypes.map(shape => ({
      shape,
      key: faker.lorem.slug(),
    })),
    randomSearchableNodes: times(20, () => ({
      shape: sample(nodeTypes),
      key: faker.lorem.slug(),
      label: faker.lorem.word(),
      labelMinor: `ip-${faker.internet
        .ip()
        .split('.')
        .join('-')}`,
    })),
    randomSvgNodes: times(20, () => ({
      shape: sample(nodeTypes),
      key: faker.lorem.slug(),
      label: faker.lorem.word(),
      labelMinor: `ip-${faker.internet
        .ip()
        .split('.')
        .join('-')}`,
    })),
    metricNodes: [0, 0.01, 0.1, 0.5, 0.9, 0.99, 1].map(value => ({
      key: faker.lorem.slug(),
      metricFormattedValue: format('.0%')(value),
      metricNumericValue: value,
    })),
    size: 65,
    contrastMode: false,
    searchTerms: [],
  };

  handleContrastModeChange = () => {
    this.setState({ contrastMode: !this.state.contrastMode });
  };

  handleSizeChange = ev => {
    this.setState({ size: Number(ev.target.value) });
  };

  handleMouseEnter = hoveredNodeId => {
    this.setState({ hoveredNodeId });
  };

  handleMouseLeave = () => {
    this.setState({ hoveredNodeId: null });
  };

  render() {
    return (
      <div>
        <CheckBox
          checked={this.state.contrastMode}
          onChange={this.handleContrastModeChange}
        />
        Contrast Mode
        <TextInput value={this.state.size} onChange={this.handleSizeChange} />
        px - node size
        <Example>
          <Info>Available Shapes</Info>
          {this.state.availableShapes.map(node => (
            <GraphNodeContainer size={this.state.size} key={node.key}>
              <GraphNode
                id={node.key}
                shape={node.shape}
                label={node.shape}
                size={this.state.size}
                contrastMode={this.state.contrastMode}
                highlighted={node.key === this.state.hoveredNodeId}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Stacked Shapes</Info>
          {this.state.stackedShape.map(node => (
            <GraphNodeContainer size={this.state.size} key={node.key}>
              <GraphNode
                stacked
                id={node.key}
                shape={node.shape}
                label={node.shape}
                size={this.state.size}
                contrastMode={this.state.contrastMode}
                highlighted={node.key === this.state.hoveredNodeId}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Random Nodes (standard format with search matches)</Info>
          <Search
            onChange={(text, terms = []) =>
              this.setState({ searchTerms: compact([text, ...terms]) })
            }
          />
          {this.state.randomSearchableNodes.map(node => (
            <GraphNodeContainer big size={this.state.size} key={node.key}>
              <GraphNode
                id={node.key}
                shape={node.shape}
                label={node.label}
                labelMinor={node.labelMinor}
                color={colorFunction(node.label)}
                searchTerms={this.state.searchTerms}
                size={this.state.size}
                contrastMode={this.state.contrastMode}
                highlighted={node.key === this.state.hoveredNodeId}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Random Nodes (exporting format)</Info>
          {this.state.randomSvgNodes.map(node => (
            <GraphNodeContainer size={this.state.size} key={node.key}>
              <GraphNode
                id={node.key}
                shape={node.shape}
                label={node.label}
                labelMinor={node.labelMinor}
                color={colorFunction(node.label)}
                size={this.state.size}
                contrastMode={this.state.contrastMode}
                highlighted={node.key === this.state.hoveredNodeId}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                forceSvg
              />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Metric Fills</Info>
          {this.state.metricNodes.map(node => (
            <GraphNodeContainer size={this.state.size} key={node.key}>
              <GraphNode
                id={node.key}
                shape="pentagon"
                label="node"
                metricFormattedValue={node.metricFormattedValue}
                metricNumericValue={node.metricNumericValue}
                size={this.state.size}
                contrastMode={this.state.contrastMode}
                highlighted={node.key === this.state.hoveredNodeId}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              />
            </GraphNodeContainer>
          ))}
        </Example>
      </div>
    );
  }
}
