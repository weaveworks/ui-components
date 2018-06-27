import React from 'react';

import { Example } from '../../utils/example';
import GraphNode from './GraphNode';

const NodeContainer = props => (
  <svg width="160px" height="160px">
    <g style={{ transform: 'translate(80px, 80px)' }}>
      {props.children}
    </g>
  </svg>
);

export default function GraphNodeExample() {
  return (
    <div>
      <Example>
        <NodeContainer>
          <GraphNode type="circle" label="blublu" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="triangle" label="blublu" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="square" label="blublu" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="pentagon" label="blublu" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="hexagon" label="dflslfkdlfk" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="heptagon" label="dflslfkdlfk" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="octagon" label="dflslfkdlfk" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="cloud" label="dflslfkdlfk" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="sheet" label="dflslfkdlfk" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="cylinder" label="dflslfkdlfk" />
        </NodeContainer>
        <NodeContainer>
          <GraphNode type="dottedcylinder" label="dflslfkdlfk" />
        </NodeContainer>
      </Example>
    </div>
  );
}
