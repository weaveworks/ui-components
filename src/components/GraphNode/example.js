import React from 'react';
import faker from 'faker';
import { keys, uniq } from 'lodash';

import { Example, Info } from '../../utils/example';
import GraphNode, { shapeMap } from './GraphNode';

const colorFunction = ({ label }) => `hsl(${(label.charCodeAt(0) - 97) * 10}, 50%, 65%)`;

const GraphNodeContainer = props => (
  <svg width="200px" height="200px">
    <g style={{ transform: 'translate(100px, 100px)' }}>
      {props.children}
    </g>
  </svg>
);

export default class GraphNodeExample extends React.Component {
  state = {
    labels: uniq(faker.lorem.words(20).split(' ')),
    metrics: ['0', '0.01', '0.1', '0.5', '0.9', '0.99', '1'],
  }

  render() {
    return (
      <div>
        <Example>
          <Info>Available Shapes</Info>
          {keys(shapeMap).map(type => (
            <GraphNodeContainer key={type}>
              <GraphNode type={type} id={type} label={type} />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Stacked Shapes</Info>
          {keys(shapeMap).map(type => (
            <GraphNodeContainer key={type}>
              <GraphNode stacked type={type} id={type} label={type} />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Random Colors</Info>
          {this.state.labels.map(label => (
            <GraphNodeContainer key={label}>
              <GraphNode type="pentagon" id={label} label={label} colorFunction={colorFunction} />
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
