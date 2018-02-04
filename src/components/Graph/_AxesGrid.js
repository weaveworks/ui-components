import React from 'react';
import styled from 'styled-components';


const AxisLine = styled.div`
  border-style: dashed;
  border-color: #ddd;
  position: absolute;
  left: 0;
  top: 0;
`;

const HorizontalLine = AxisLine.extend.attrs({
  style: ({ top, width }) => ({ top, width })
})`
  border-width: 1px 0 0 0;
`;

const VerticalLine = AxisLine.extend.attrs({
  style: ({ left, height }) => ({ left, height })
})`
  border-width: 0 0 0 1px;
`;

const TickContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
`;

const TickLabel = styled.span`
  color: #555;
  display: block;
  font-size: 12px;
  position: absolute;
  white-space: nowrap;
`;

const YAxisTickLabel = TickLabel.extend.attrs({
  style: ({ top }) => ({ top: top - 8, right: 5 }),
})``;

const XAxisTickLabel = TickLabel.extend.attrs({
  style: ({ left, top }) => ({ left, top: top + 5 }),
})``;

class AxesGrid extends React.PureComponent {
  render() {
    const { width, height, timeScale, yAxisTicks, timeTicks } = this.props;
    if (!width || !height) return null;

    const [startTime, endTime] = timeScale.domain();
    const xAxisTicks = timeTicks.getSpread(startTime, endTime, timeScale);

    return (
      <div className="axes-grid">
        {yAxisTicks.map(({ value, offset }) => (
          <TickContainer key={value}>
            <HorizontalLine width={width} top={offset} />
            <YAxisTickLabel top={offset}>
              {value}
            </YAxisTickLabel>
          </TickContainer>
        ))}
        {xAxisTicks.map(({ value, offset }) => (
          <TickContainer key={value}>
            <VerticalLine height={height} left={offset} />
            <XAxisTickLabel top={height} left={offset}>
              {value}
            </XAxisTickLabel>
          </TickContainer>
        ))}
      </div>
    );
  }
}

export default AxesGrid;
