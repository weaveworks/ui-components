import React from 'react';
import styled from 'styled-components';


const HoverLine = styled.line.attrs({
  stroke: '#aaa',
  strokeWidth: 1,
})`
  pointer-events: none;
`;

const HoverCircle = styled.circle.attrs({
  opacity: ({ focused }) => (focused ? 1 : 0.5),
  r: ({ focused }) => (focused ? 4 : 3),
  strokeWidth: 3,
  fill: '#fff',
})`
  pointer-events: none;
`;

class GraphHoverBar extends React.PureComponent {
  render() {
    const { hoverXOffset, hoverPoints, valueScale, height } = this.props;
    if (!hoverPoints) return null;

    // Render focused circle last so that it stands out.
    const sortedHoverPoints = [...hoverPoints].sort(a => (a.focused ? 1 : -1));

    return (
      <g transform={`translate(${hoverXOffset}, 0)`}>
        <HoverLine y2={height} />
        {sortedHoverPoints.map(datapoint => (
          <HoverCircle
            key={datapoint.key}
            stroke={datapoint.color}
            focused={datapoint.focused}
            cy={valueScale(datapoint.graphValue)}
          />
        ))}
      </g>
    );
  }
}

export default GraphHoverBar;
