import React from 'react';
import faker from 'faker';
import { keys, times, sample } from 'lodash';

import { Example, Info } from '../../utils/example';
import GraphNode, { shapeMap } from './GraphNode';

const nodeTypes = keys(shapeMap);
const colorFunction = ({ label }) =>
  `hsl(${(label.charCodeAt(0) - 97) * 10}, 50%, 65%)`;

const GraphNodeContainer = ({ big, children }) => (
  <svg width={`${big ? 300 : 150}px`} height={`${big ? 300 : 175}px`}>
    <g style={{ transform: 'translate(75px, 100px)' }}>
      {children}
    </g>
  </svg>
);

export default class GraphNodeExample extends React.Component {
  state = {
    randomNodes: times(20, () => ({
      type: sample(nodeTypes),
      key: faker.lorem.slug(),
      label: faker.lorem.word(),
      labelMinor: `ip-${faker.internet
        .ip()
        .split('.')
        .join('-')}`,
    })),
    metrics: ['0', '0.01', '0.1', '0.5', '0.9', '0.99', '1'],
    matches: {
      label: { start: 1, length: 2 },
      labelMinor: { start: 10, length: 5 },
      parents: {
        docker_image_name: {
          label: 'Image name',
          length: 2,
          start: 15,
          text: 'weaveworks/weaveexec',
        },
        docker_container_state_human: {
          label: 'State',
          length: 2,
          start: 14,
          text: 'Exited (0) 4 weeks ago',
        },
        docker_container_id: {
          label: 'ID',
          length: 2,
          start: 1,
          text: '7ee2f74343c81a1593db52cb147d615a62d928df698d554f00d19b49a690895b',
        },
      }
    },
  };

  render() {
    return (
      <div>
        <Example>
          <Info>Available Shapes</Info>
          {nodeTypes.map(type => (
            <GraphNodeContainer key={type}>
              <GraphNode type={type} id={type} label={type} />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Stacked Shapes</Info>
          {nodeTypes.map(type => (
            <GraphNodeContainer key={type}>
              <GraphNode stacked type={type} id={type} label={type} />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Random Nodes (standard format with matches)</Info>
          {this.state.randomNodes.map(node => (
            <GraphNodeContainer big key={node.key}>
              <GraphNode
                id={node.key}
                type={node.type}
                label={node.label}
                labelMinor={node.labelMinor}
                colorFunction={colorFunction}
                matches={this.state.matches}
              />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Random Nodes (exporting format)</Info>
          {this.state.randomNodes.map(node => (
            <GraphNodeContainer key={node.key}>
              <GraphNode
                id={node.key}
                type={node.type}
                label={node.label}
                labelMinor={node.labelMinor}
                colorFunction={colorFunction}
                forceSvg
              />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Metric Fills</Info>
          {this.state.metrics.map(metric => (
            <GraphNodeContainer key={metric}>
              <GraphNode
                type="pentagon"
                id={metric}
                label="node"
                metricText={metric}
                metricValue={Number(metric)}
              />
            </GraphNodeContainer>
          ))}
        </Example>
      </div>
    );
  }
}
