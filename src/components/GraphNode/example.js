import React from 'react';
import faker from 'faker';
import { keys, uniq } from 'lodash';

import { Example, Info } from '../../utils/example';
import GraphNode, { shapeMap } from './GraphNode';

const GraphNodeContainer = props => (
  <svg width="200px" height="200px">
    <g style={{ transform: 'translate(100px, 100px)' }}>
      {props.children}
    </g>
  </svg>
);

export default class GraphNodeExample extends React.Component {
  state = {
    ranks: uniq(faker.lorem.words(20).split(' ')),
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
          <Info>Random Ranks</Info>
          {this.state.ranks.map(rank => (
            <GraphNodeContainer key={rank}>
              <GraphNode type="pentagon" id={rank} label={rank} rank={rank} />
            </GraphNodeContainer>
          ))}
        </Example>
        <Example>
          <Info>Pseudo Nodes</Info>
          <GraphNodeContainer>
            <GraphNode pseudo type="square" id="square" label="Uncontained" />
          </GraphNodeContainer>
          <GraphNodeContainer>
            <GraphNode pseudo type="cloud" id="cloud" label="Internet" />
          </GraphNodeContainer>
        </Example>
      </div>
    );
  }
}
