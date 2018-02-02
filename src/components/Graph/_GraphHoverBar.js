import React from 'react';
import styled from 'styled-components';

const HOVER_CIRCLE_RADIUS = 4;

const HoverLine = styled.div.attrs({
  style: ({ left, height }) => ({ left, height }),
})`
  border-left: 1px solid #aaa;
  pointer-events: none;
  position: absolute;
  top: 0;
`;

const HoverCircle = styled.span.attrs({
  style: ({ top }) => ({ top }),
})`
  border: 3px solid ${props => props.color};
  opacity: ${props => (props.focused ? 1 : 0.5)};
  margin-left: -${HOVER_CIRCLE_RADIUS}px;
  margin-top: -${HOVER_CIRCLE_RADIUS}px;
  width: ${2 * HOVER_CIRCLE_RADIUS}px;
  height: ${2 * HOVER_CIRCLE_RADIUS}px;
  box-sizing: border-box;
  background-color: #fff;
  pointer-events: none;
  border-radius: 50%;
  position: absolute;
`;

class GraphHoverBar extends React.PureComponent {
  render() {
    const { hoverXOffset, hoverPoints, valueScale, height } = this.props;
    if (!hoverPoints) return null;

    // Render focused circle last so that it stands out.
    const sortedHoverPoints = [...hoverPoints].sort(a => (a.focused ? 1 : -1));

    return (
      <HoverLine left={hoverXOffset} height={height}>
        {sortedHoverPoints.map(datapoint => (
          <HoverCircle
            key={datapoint.key}
            color={datapoint.color}
            focused={datapoint.focused}
            top={valueScale(datapoint.graphValue)}
          />
        ))}
      </HoverLine>
    );
  }
}

export default GraphHoverBar;
