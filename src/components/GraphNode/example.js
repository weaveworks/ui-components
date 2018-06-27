import React from 'react';

import { Example } from '../../utils/example';
import GraphNode from './GraphNode';

const NodeContainer = props => (
  <svg width="100px" height="100px">
    <g style={{ transform: 'translate(50px, 50px)' }}>
      {props.children}
    </g>
  </svg>
);

export default function GraphNodeExample() {
  return (
    <div>
      <Example>
        <NodeContainer><GraphNode type="pentagon" /></NodeContainer>
        <NodeContainer><GraphNode type="hexagon" /></NodeContainer>
      </Example>
    </div>
  );
}
