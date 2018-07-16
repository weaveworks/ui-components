import React from 'react';
import styled from 'styled-components';
import { initial, last, shuffle } from 'lodash';

import { Example } from '../../utils/example';
import GraphNode from '../GraphNode';

import GraphEdge from './GraphEdge';

const A = { x: 100, y: 50 };
const B = { x: 30, y: 100 };
const C = { x: 170, y: 200 };
const D = { x: 100, y: 250 };

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

const GraphEdgeContainer = ({ children }) => (
  <svg width="200px" height="300px">
    {children}
  </svg>
);

const TranslatedNode = ({ name, point, ...props }) => (
  <g key={name} transform={`translate(${point.x}, ${point.y})`}>
    <GraphNode shape="circle" id={name} label={name} size={50} {...props} />
  </g>
);

export default class GraphNodeExample extends React.Component {
  state = {
    thickness: 1,
    arrowOffset: 28,
    contrastMode: false,
    highlightedEdgeId: null,
    edges: [
      { id: 'straight-edge', waypoints: [A, D] },
      { id: 'curvy-edge', waypoints: [A, B, C, D], withArrow: true },
      { id: 'dotted-edge', waypoints: [A, B, C, D], isDotted: true },
      {
        id: 'animated-edge',
        waypoints: [A, C, B, D],
        withArrow: true,
        isAnimated: true,
      },
    ],
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({
        edges: [
          ...initial(this.state.edges),
          {
            ...last(this.state.edges),
            waypoints: [A, ...shuffle([B, C]), D],
          },
        ],
      });
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleContrastModeChange = () => {
    this.setState({ contrastMode: !this.state.contrastMode });
  };

  handleThicknessChange = ev => {
    this.setState({ thickness: Number(ev.target.value) });
  };

  handleArrowOffsetChange = ev => {
    this.setState({ arrowOffset: Number(ev.target.value) });
  };

  handleEdgeMouseEnter = highlightedEdgeId => {
    this.setState({ highlightedEdgeId });
  };

  handleEdgeMouseLeave = () => {
    this.setState({ highlightedEdgeId: null });
  };

  render() {
    return (
      <div>
        <CheckBox
          checked={this.state.contrastMode}
          onChange={this.handleContrastModeChange}
        />
        Contrast Mode
        <TextInput
          value={this.state.thickness}
          onChange={this.handleThicknessChange}
        />
        px - edge thickness
        <TextInput
          value={this.state.arrowOffset}
          onChange={this.handleArrowOffsetChange}
        />
        px - arrow offset
        <Example>
          {this.state.edges.map(edge => (
            <GraphEdgeContainer key={edge.id}>
              <GraphEdge
                id={edge.id}
                waypoints={edge.waypoints}
                withArrow={
                  edge.withArrow || edge.id === this.state.highlightedEdgeId
                }
                highlighted={edge.id === this.state.highlightedEdgeId}
                isDotted={edge.isDotted}
                isAnimated={edge.isAnimated}
                thickness={this.state.thickness}
                arrowOffset={this.state.arrowOffset}
                contrastMode={this.state.contrastMode}
                onMouseEnter={this.handleEdgeMouseEnter}
                onMouseLeave={this.handleEdgeMouseLeave}
              />
              <TranslatedNode
                name="source"
                point={A}
                contrastMode={this.state.contrastMode}
              />
              <TranslatedNode
                name="target"
                point={D}
                contrastMode={this.state.contrastMode}
              />
            </GraphEdgeContainer>
          ))}
        </Example>
      </div>
    );
  }
}
