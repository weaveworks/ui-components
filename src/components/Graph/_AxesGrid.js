import React from 'react';
import styled from 'styled-components';


const AxisLine = styled.line.attrs({
  stroke: '#ccc',
  strokeDasharray: [1, 2],
  strokeWidth: 1,
})``;

const HorizontalLine = AxisLine.extend.attrs({
  x2: props => props.width,
  y1: props => props.offset,
  y2: props => props.offset,
});

const VerticalLine = AxisLine.extend.attrs({
  y2: props => props.height,
  x1: props => props.offset,
  x2: props => props.offset,
});

class AxesGrid extends React.PureComponent {
  render() {
    const { width, height, xAxisTicks, yAxisTicks } = this.props;
    if (!width || !height) return null;

    return (
      <g className="axes-grid">
        {yAxisTicks.map(({ offset, value }) => (
          <HorizontalLine key={value} width={width} offset={offset} />
        ))}
        {xAxisTicks.map(({ offset, value }) => (
          <VerticalLine key={value} height={height} offset={offset} />
        ))}
      </g>
    );
  }
}

export default AxesGrid;
