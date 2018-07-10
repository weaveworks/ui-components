import React from 'react';
import faker from 'faker';
import { format } from 'd3-format';
import { keys, times, sample, map, fromPairs, compact, isEmpty } from 'lodash';

import { Example, Info } from '../../utils/example';
import Search from '../Search';
import GraphNode, { shapeMap } from './GraphNode';

const nodeTypes = keys(shapeMap);
const colorFunction = label =>
  `hsl(${(label.charCodeAt(0) - 97) * 10}, 50%, 65%)`;

const GraphNodeContainer = ({ big, children }) => (
  <svg width={`${big ? 300 : 150}px`} height={`${big ? 300 : 175}px`}>
    <g style={{ transform: 'translate(75px, 100px)' }}>{children}</g>
  </svg>
);

const findFirstMatch = (text, terms) => {
  let match = {};

  terms.forEach(term => {
    const start = text.search(term);
    if (isEmpty(match) && start !== -1) {
      match = { start, length: term.length };
    }
  });

  return match;
};

export default class GraphNodeExample extends React.Component {
  state = {
    availableShapes: nodeTypes.map(type => ({
      type,
      key: faker.lorem.slug(),
    })),
    stackedShape: nodeTypes.map(type => ({
      type,
      key: faker.lorem.slug(),
    })),
    randomSearchableNodes: times(20, () => ({
      type: sample(nodeTypes),
      key: faker.lorem.slug(),
      label: faker.lorem.word(),
      labelMinor: `ip-${faker.internet
        .ip()
        .split('.')
        .join('-')}`,
      metadata: {
        docker_image_name: {
          label: 'Image name',
          text: faker.lorem
            .words(2)
            .split(' ')
            .join('/'),
        },
        docker_container_state_human: {
          label: 'State',
          text: faker.lorem.sentence(4),
        },
        docker_container_id: {
          label: 'ID',
          text: faker.random.alphaNumeric(50),
        },
      },
    })),
    randomSvgNodes: times(20, () => ({
      type: sample(nodeTypes),
      key: faker.lorem.slug(),
      label: faker.lorem.word(),
      labelMinor: `ip-${faker.internet
        .ip()
        .split('.')
        .join('-')}`,
    })),
    metricNodes: [0, 0.01, 0.1, 0.5, 0.9, 0.99, 1].map(metricValue => ({
      key: faker.lorem.slug(),
      metricLabel: format('.0%')(metricValue),
      metricValue,
    })),
    hoveredNode: null,
    matches: {},
  };

  searchRandomNodes = terms => {
    this.setState({
      matches: fromPairs(
        map(this.state.randomSearchableNodes, node => [
          node.key,
          {
            label: findFirstMatch(node.label, terms),
            labelMinor: findFirstMatch(node.labelMinor, terms),
            parents: fromPairs(
              compact(
                map(node.metadata, (value, key) => {
                  const match = findFirstMatch(value.text, terms);
                  return !isEmpty(match) && [key, { ...match, ...value }];
                })
              )
            ),
          },
        ])
      ),
    });
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
        <Example>
          <Info>Available Shapes</Info>
          {this.state.availableShapes.map(node => (
            <GraphNodeContainer key={node.key}>
              <GraphNode
                id={node.key}
                type={node.type}
                label={node.type}
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
            <GraphNodeContainer key={node.key}>
              <GraphNode
                stacked
                id={node.key}
                type={node.type}
                label={node.type}
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
              this.searchRandomNodes(compact([text, ...terms]))
            }
          />
          {this.state.randomSearchableNodes.map(node => (
            <GraphNodeContainer big key={node.key}>
              <GraphNode
                id={node.key}
                type={node.type}
                label={node.label}
                labelMinor={node.labelMinor}
                color={colorFunction(node.label)}
                matches={this.state.matches[node.key]}
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
            <GraphNodeContainer key={node.key}>
              <GraphNode
                id={node.key}
                type={node.type}
                label={node.label}
                labelMinor={node.labelMinor}
                color={colorFunction(node.label)}
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
            <GraphNodeContainer key={node.key}>
              <GraphNode
                id={node.key}
                type="pentagon"
                label="node"
                metricLabel={node.metricLabel}
                metricValue={node.metricValue}
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
