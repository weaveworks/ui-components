import React from 'react';

import { Example } from '../../utils/example';

import GraphEdge from './GraphEdge';

const GraphEdgeContainer = ({ children }) => (
  <svg width="100%" height="300px">
    {children}
  </svg>
);

export default class GraphNodeExample extends React.Component {
  state = {
    contrastMode: false,
  };

  handleContrastModeChange = () => {
    this.setState({ contrastMode: !this.state.contrastMode });
  };

  render() {
    return (
      <div>
        <Example>
          {this.state.edges.map(edge => (
            <GraphEdgeContainer key={edge.key}>
              <GraphEdge id={edge.key} />
            </GraphEdgeContainer>
          ))}
        </Example>
      </div>
    );
  }
}
